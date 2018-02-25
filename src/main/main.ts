import createTsCompiler from '@lonord/electron-renderer-ts-compiler'
import * as electron from 'electron'
import { app, BrowserWindow } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import * as isDev from 'electron-is-dev'
import * as path from 'path'
import * as url from 'url'
import * as cfg from './config'

// tslint:disable-next-line:no-string-literal
global['pi-dashboard-config'] = cfg

const tsCompiler = createTsCompiler()
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
		pathname: path.join(__dirname, '../../index.html'),
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
		mainWindow = null
	})
}

app.on('ready', () => {
	if (isDev) {
		console.log('> electron is in dev mode')
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err))
		tsCompiler(createWindow, () => mainWindow && mainWindow.reload())
	} else {
		createWindow()
	}
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	app.quit()
})
