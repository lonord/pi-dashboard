import { remote } from 'electron'

export interface SlashUtil {
	notifyLoadComplete()
}

export const slashUtil = remote.getGlobal('pi-dashboard-slash') as SlashUtil
