import { EventEmitter } from 'events'
import { existsSync, readFile, readFileSync, symlinkSync, unlinkSync, watch, writeFileSync } from 'fs'
import * as debounce from 'lodash.debounce'
import * as mkdirp from 'mkdirp'
import { homedir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import * as YAML from 'yamljs'
import npmInstall from './npm-installer'

const readFileAsync = promisify(readFile)

const emitter = new EventEmitter()
const configHome = join(homedir(), '.pi-dashboard')
const configDir = join(configHome, 'modules')
const configFile = join(configHome, 'config.yml')
const nodeModuleDirectory = join(configDir, 'node_modules')
const linkedModuleDirectory = join(configHome, 'node_modules')
const invalidModuleNameReg = /^\*\*(.*)\*\*$/

const internalNodeModuleDir = join(__dirname, '../../node_modules')

mkdirp.sync(configDir)
if (existsSync(linkedModuleDirectory)) {
	unlinkSync(linkedModuleDirectory)
}
symlinkSync(internalNodeModuleDir, linkedModuleDirectory)
initConfigFile(configFile)

let configObj = YAML.parse(readFileSync(configFile, 'utf8')) || {}
if (!validConfigContent(configObj)) {
	throw new Error('configuration file format error')
}

watch(configFile, debounce(update, 1000))

function update() {
	readFileAsync(configFile, 'utf8').catch((err) => {
		return Promise.reject('配置文件读取失败')
	}).then((content) => {
		emitter.emit('start-update')
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
		}
	}).catch((msg) => {
		emitter.emit('err', msg)
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

function initConfigFile(configFile: string) {
	if (!existsSync(configFile)) {
		const str = readFileSync(join(__dirname, '../../resource/config/default-module-config.yml'), 'utf8')
		writeFileSync(configFile, str, 'utf8')
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

export {
	addListener,
	removeListener,
	getConfig,
	trigUpdate,
	purgeListeners,
	getNodeModulesDirectory
}
