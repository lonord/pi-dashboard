import { remote } from 'electron'

export interface ModulePackage {
	author: string
	version: string
}
export const modulePackage = remote.require('../../package.json') as ModulePackage

export type UpdatedListenerFn = (event: 'updated', fn: (config: PiConfig) => void) => void
export type StartUpdateListenerFn = (event: 'start-update', fn: () => void) => void
export type ErrorListenerFn = (event: 'err', fn: (msg: string) => void) => void
export type ListenerFn = UpdatedListenerFn | StartUpdateListenerFn | ErrorListenerFn
export interface ConfigUtil {
	addListener(event: 'updated', fn: (config: PiConfig) => void)
	addListener(event: 'start-update', fn: () => void)
	addListener(event: 'err', fn: (msg: string) => void)
	removeListener(event: 'updated', fn: (config: PiConfig) => void)
	removeListener(event: 'start-update', fn: () => void)
	removeListener(event: 'err', fn: (msg: string) => void)
	getConfig(): PiConfig
	trigUpdate()
	getNodeModulesDirectory(): string
	writeProperties(props: any): Promise<void>
	readProperties(): Promise<any>
	purgeListeners()
}
export interface PiConfig {
	globalConfig: { [key: string]: any }
	modules: { [name: string]: { [key: string]: any } }
}
export const configUtil = remote.getGlobal('pi-dashboard-config') as ConfigUtil

window.addEventListener('unload', () => {
	configUtil.purgeListeners()
})
