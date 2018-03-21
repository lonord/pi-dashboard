import * as electron from 'electron'
import { app, BrowserWindow } from 'electron'
import * as isDev from 'electron-is-dev'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'
import * as cfg from './config'

// tslint:disable-next-line:no-string-literal
global['pi-dashboard-config'] = cfg
// tslint:disable-next-line:no-string-literal
global['main-action'] = {
	update: () => autoUpdater.checkForUpdatesAndNotify()
}

// cfg.addListener('updated', () => console.log('updated'))
// cfg.addListener('start-update', () => console.log('start-update'))
// cfg.addListener('err', () => console.log('err'))

let mainWindow: BrowserWindow

function createWindow() {
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
		clearConfigListeners()
		mainWindow = null
	})
}

function clearConfigListeners() {
	cfg.purgeListeners()
}

app.on('ready', () => {
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
			clearConfigListeners()
			tsCompiler(createWindow, () => {
				if (mainWindow) {
					mainWindow.reload()
				}
			})
		}
		cfg.addListener('updated', next)
		cfg.addListener('err', next)
		cfg.trigUpdate()
	} else {
		createWindow()
	}
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	app.quit()
})
