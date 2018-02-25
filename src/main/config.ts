import { EventEmitter } from 'events'
import { existsSync, readFile, readFileSync, watch, writeFileSync } from 'fs'
import * as debounce from 'lodash.debounce'
import * as mkdirp from 'mkdirp'
import { homedir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import * as YAML from 'yamljs'
import npmInstall from './npm-installer'

const readFileAsync = promisify(readFile)

const emitter = new EventEmitter()
const configDir = join(homedir(), '.pi-dashboard')
const configFile = join(configDir, 'config.yml')
const invalidModuleNameReg = /^\*\*(.*)\*\*$/

mkdirp.sync(configDir)
initConfigFile(configFile)

let configObj = YAML.parse(readFileSync(configFile, 'utf8')) || {}
if (!validConfigContent(configObj)) {
	throw new Error('configuration file format error')
}

watch(configFile, debounce((event: string) => {
	readFileAsync(configFile, 'utf8').catch((err) => {
		return Promise.reject('配置文件读取失败')
	}).then((content) => {
		const newConfigObj = YAML.parse(content)
		if (validConfigContent(newConfigObj)) {
			const componentModules = newConfigObj.componentModules || []
			const modules = componentModules.map((m) => m.name).filter((m) => !invalidModuleNameReg.test(m))
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
			emitter.emit('update', getConfig())
		}
	}).catch((msg) => {
		emitter.emit('err', msg)
	})
}, 1000))

function addUpdateListener(fn: (config: any) => void) {
	emitter.addListener('update', fn)
}

function removeUpdateListener(fn: (config: any) => void) {
	emitter.removeListener('update', fn)
}

function addErrorListener(fn: (msg: string) => void) {
	emitter.addListener('err', fn)
}

function removeErrorListener(fn: (msg: string) => void) {
	emitter.removeListener('err', fn)
}

function getConfig() {
	const globalConfig = configObj.globalConfig || {}
	const componentModules = configObj.componentModules || []
	const obj = {
		globalConfig,
		modules: {} as any
	}
	for (const m of componentModules) {
		const { name, ...rest } = m
		if (invalidModuleNameReg.test(name)) {
			continue
		}
		obj.modules[name] = {
			...globalConfig,
			...rest
		}
	}
	return obj
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

async function installModule(modules: string[], destDir: string) {
	const result = await npmInstall(modules, destDir)
	if (result.code !== 0) {
		throw new Error(result.output)
	}
	return result
}

export {
	addUpdateListener,
	removeUpdateListener,
	addErrorListener,
	removeErrorListener,
	getConfig
}
