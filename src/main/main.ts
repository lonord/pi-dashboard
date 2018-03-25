import * as electron from 'electron'
import { app, BrowserWindow, dialog } from 'electron'
import * as isDev from 'electron-is-dev'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'
import createActionManager from './action'
import createConfigManager, { ConfigManager } from './config'

const actions = createActionManager()

// tslint:disable-next-line:no-string-literal
global['main-action'] = actions

let mainWindow: BrowserWindow
let slashWindow: BrowserWindow

function createWindow(cfg: ConfigManager) {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 800,
		minHeight: 600,

		title: 'Pi Dashboard',
		frame: false
	})

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: cfg.getHTMLIndexFile(),
		protocol: 'file:',
		slashes: true
	}))

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		clearConfigListeners(cfg)
		mainWindow = null
	})

	if (cfg.getSystemConfig().kiosk) {
		mainWindow.setKiosk(true)
	}

	if (slashWindow) {
		slashWindow.close()
		slashWindow = null
	}
}

function createSlashWindow(onShow: () => void) {

	global['pi-dashboard-slash'] = {
		notifyLoadComplete: () => {
			setTimeout(onShow, 100)
		}
	}

	slashWindow = new BrowserWindow({
		width: 218,
		height: 100,
		resizable: false,

		title: 'Loading...',
		frame: false
	})

	// and load the index.html of the app.
	slashWindow.loadURL(url.format({
		pathname: path.join(__dirname, '../../slash.html'),
		protocol: 'file:',
		slashes: true
	}))
}

function clearConfigListeners(cfg: ConfigManager) {
	cfg.purgeListeners()
}

app.on('ready', () => {
	createSlashWindow(() => {
		const cfg = createConfigManager()
		// tslint:disable-next-line:no-string-literal
		global['pi-dashboard-config'] = cfg
		if (isDev) {
			console.log('> electron is in dev mode')
			const devToolInstaller = require('electron-devtools-installer')
			const installExtension = devToolInstaller.default
			installExtension(devToolInstaller.REACT_DEVELOPER_TOOLS)
				.then((name) => console.log(`Added Extension:  ${name}`))
				.catch((err) => console.log('An error occurred: ', err))
			const createTsCompiler = require('@lonord/electron-renderer-ts-compiler').default
			const tsCompiler = createTsCompiler()
			const next = () => {
				clearConfigListeners(cfg)
				tsCompiler(() => createWindow(cfg), () => {
					if (mainWindow) {
						mainWindow.reload()
					}
				})
			}
			cfg.addListener('updated', next)
			cfg.addListener('err', next)
			cfg.trigUpdate()
		} else {
			createWindow(cfg)
		}
	})
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	app.quit()
})
