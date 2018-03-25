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
			let errorEmitted = false
			const emitError = (err) => {
				if (errorEmitted) {
					return
				}
				fn(err)
				errorEmitted = true
			}
			autoUpdater.once('update-downloaded', () => {
				try {
					autoUpdater.quitAndInstall()
				} catch (e) {
					console.error(e)
					emitError(e)
				}
			})
			autoUpdater.once('error', (err) => {
				emitError(err)
			})
			autoUpdater.downloadUpdate()
		}
	}
}
