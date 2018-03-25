import { autoUpdater } from 'electron-updater'

export default function createActionManager() {
	autoUpdater.autoDownload = false
	return {
		checkUpdate: (fn: (err: any, updateAvailable: boolean) => void) => {
			autoUpdater.once('update-available', () => fn(null, true))
			autoUpdater.once('update-not-available', () => fn(null, false))
			autoUpdater.once('error', (err) => fn(err, false))
			autoUpdater.checkForUpdates()
		},
		downloadAndInstallUpdate: (fn: (err: any) => void) => {
			autoUpdater.once('update-downloaded', () => {
				autoUpdater.quitAndInstall()
			})
			autoUpdater.once('error', (err) => fn(err))
			autoUpdater.downloadUpdate()
		}
	}
}
