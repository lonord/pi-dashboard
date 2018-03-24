import * as asar from 'asar'
import * as bluebird from 'bluebird'
import * as isDev from 'electron-is-dev'
import { EventEmitter } from 'events'
import {
	existsSync,
	FSWatcher,
	readFile,
	readFileSync,
	symlinkSync,
	unlinkSync,
	watch,
	writeFile,
	writeFileSync
} from 'fs'
import { copySync } from 'fs-extra'
import * as debounce from 'lodash.debounce'
import * as mkdirp from 'mkdirp'
import { homedir, tmpdir } from 'os'
import { join } from 'path'
import * as rimraf from 'rimraf'
import * as YAML from 'yamljs'
import npmInstall from './npm-installer'

const readFileAsync = bluebird.promisify<any, string, string>(readFile)
const writeFileAsync = bluebird.promisify<any, string, string, string>(writeFile)

export interface ConfigManager {
	addListener(event: 'updated', fn: (config: any) => void)
	addListener(event: 'start-update', fn: () => void)
	addListener(event: 'err', fn: (msg: string) => void)
	removeListener(event: 'updated', fn: (config: any) => void)
	removeListener(event: 'start-update', fn: () => void)
	removeListener(event: 'err', fn: (msg: string) => void)
	getConfig(): any
	trigUpdate()
	getNodeModulesDirectory(): string
	writeProperties(props: any): Promise<void>
	readProperties(): Promise<any>
	purgeListeners()
	getHTMLIndexFile(): string
}

export default function createConfigManager(): ConfigManager {
	const emitter = new EventEmitter()
	const configHome = join(homedir(), '.pi-dashboard')
	const configDir = join(configHome, 'modules')
	const configFile = join(configHome, 'config.yml')
	const propertiesFile = join(configHome, 'properties.json')
	const nodeModuleDirectory = join(configDir, 'node_modules')
	const targetNodeModuleDir = join(configHome, 'node_modules')
	const targetAppDir = join(configHome, 'app')
	const invalidModuleNameReg = /^\*\*(.*)\*\*$/

	const internalNodeModuleDir = join(__dirname, '../../node_modules')

	mkdirp.sync(configDir)
	if (!existsSync(propertiesFile)) {
		writeFileSync(propertiesFile, '{}', 'utf8')
	}
	initConfigFile(configFile)
	initInternalApp()

	let configObj = YAML.parse(readFileSync(configFile, 'utf8')) || {}
	if (!validConfigContent(configObj)) {
		throw new Error('configuration file format error')
	}

	let watcher: FSWatcher = null
	const watchConfigFile = () => {
		if (watcher != null) {
			watcher.close()
		}
		watcher = watch(configFile, debounce(update, 1000))
	}

	watchConfigFile()

	function update() {
		console.log('config file changed')
		watchConfigFile()
		readFileAsync(configFile, 'utf8').catch((err) => {
			return Promise.reject('配置文件读取失败')
		}).then((content) => {
			emitter.emit('start-update')
			console.log('start update modules')
			const newConfigObj = YAML.parse(content)
			if (validConfigContent(newConfigObj)) {
				const componentModules = newConfigObj.componentModules || []
				const modules = componentModules.map((m) => ({
					name: m._name,
					tag: m._tag
				})).filter((mo) => !invalidModuleNameReg.test(mo.name))
				return installModule(modules, configDir).then((result) => {
					if (result.isAbort) {
						console.log('previous npm install process is aborted')
						return null
					}
					console.log('npm install completed')
					return newConfigObj
				}).catch((err) => Promise.reject('模块安装失败: ' + err.message))
			} else {
				return Promise.reject('配置文件格式不正确')
			}
		}).then((newConfigObj) => {
			// newConfigObj为null表示忽略该次操作
			if (newConfigObj) {
				configObj = newConfigObj
				emitter.emit('updated', getConfig())
				console.log('update succeed')
			}
		}).catch((msg) => {
			emitter.emit('err', msg)
			console.error('update failed', msg)
		})
	}

	type EventType = 'updated' | 'err' | 'start-update'

	function addListener(event: EventType, fn: (arg: any) => void) {
		emitter.addListener(event, fn)
	}

	function removeListener(event: EventType, fn: (arg: any) => void) {
		emitter.removeListener(event, fn)
	}

	function getConfig() {
		const globalConfig = configObj.globalConfig || {}
		const componentModules = configObj.componentModules || []
		const obj = {
			globalConfig,
			modules: {} as any
		}
		for (const m of componentModules) {
			const { _name, _tag, ...rest } = m
			if (invalidModuleNameReg.test(_name)) {
				continue
			}
			obj.modules[_name] = {
				...globalConfig,
				...rest
			}
		}
		return obj
	}

	function trigUpdate() {
		update()
	}

	function purgeListeners() {
		emitter.removeAllListeners()
	}

	function getNodeModulesDirectory() {
		return nodeModuleDirectory
	}

	async function writeProperties(props: any) {
		try {
			await writeFileAsync(propertiesFile, JSON.stringify(props, null, 2), 'utf8')
		} catch (e) {
			console.error(e)
		}
	}

	async function readProperties() {
		try {
			const content = await readFileAsync(propertiesFile, 'utf8')
			return JSON.parse(content)
		} catch (e) {
			console.error(e)
			return {}
		}
	}

	function getHTMLIndexFile() {
		return isDev ? join(__dirname, '../../index.html') : join(targetAppDir, 'index.html')
	}

	function initConfigFile(configFile: string) {
		if (!existsSync(configFile)) {
			const str = readFileSync(join(__dirname, '../../resource/config/default-module-config.yml'), 'utf8')
			writeFileSync(configFile, str, 'utf8')
		}
	}

	function initInternalApp() {
		rimraf.sync(targetNodeModuleDir)
		rimraf.sync(targetAppDir)
		if (isDev) {
			symlinkSync(internalNodeModuleDir, targetNodeModuleDir)
		} else {
			const tmpPath = join(tmpdir(), 'name.lonord.pi.dashboard')
			rimraf.sync(tmpPath)
			asar.extractAll(join(__dirname, '../../../app.asar'), tmpPath)
			copySync(join(tmpPath, './node_modules'), targetNodeModuleDir, {
				filter: (src, dest) => !src.startsWith(join(tmpPath, './node_modules/electron/'))
			})

			mkdirp.sync(targetAppDir)
			mkdirp.sync(join(targetAppDir, 'lib'))
			copySync(join(tmpPath, './resource'), join(targetAppDir, 'resource'))
			copySync(join(tmpPath, './lib/renderer'), join(targetAppDir, 'lib/renderer'))
			copySync(join(tmpPath, './index.html'), join(targetAppDir, 'index.html'))
			rimraf.sync(tmpPath)
		}
	}

	function validConfigContent(configObj: any): boolean {
		return configObj.globalConfig && configObj.componentModules
	}

	async function installModule(modules: Array<{ name: string, tag?: string }>, destDir: string) {
		const result = await npmInstall(modules, destDir)
		if (result.code !== 0) {
			throw new Error(result.output)
		}
		return result
	}

	return {
		addListener,
		removeListener,
		getConfig,
		trigUpdate,
		purgeListeners,
		getNodeModulesDirectory,
		writeProperties,
		readProperties,
		getHTMLIndexFile
	}
}
