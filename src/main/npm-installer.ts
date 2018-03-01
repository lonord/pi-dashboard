import { ChildProcess, fork } from 'child_process'
import * as debug from 'debug'
import { writeFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const log = debug('pi-dashboard:npm-installer')

const writeFileAsync = promisify(writeFile)

let installProcess: ChildProcess = null

export default async function npmInstall(modules: string[], destDir: string) {
	const pkgDep = {
		dependencies: {}
	}
	for (const m of modules) {
		pkgDep.dependencies[m] = 'latest'
	}
	log('write package.json %j', pkgDep)
	await writeFileAsync(join(destDir, 'package.json'), JSON.stringify(pkgDep), 'utf8')
	const npmResult = await execNpmInstall(destDir)
	return npmResult
}

function execNpmInstall(cwd: string): Promise<{ code: number, output: string, isAbort: boolean }> {
	const npmCliPath = join(__dirname, '../../node_modules/npm/bin/npm-cli.js')
	return new Promise((resolve) => {
		checkAlreadyRunning(() => {
			installSingle(npmCliPath, cwd, (result) => {
				if (result.signal === 'SIGINT') {
					resolve({
						code: 0,
						output: result.output,
						isAbort: true
					})
				} else {
					resolve({
						code: result.code,
						output: result.output,
						isAbort: false
					})
				}
			})
		})
	})
}

function checkAlreadyRunning(fn: () => void) {
	if (installProcess && installProcess.connected && !installProcess.killed) {
		log('npm install is in process, kill it')
		installProcess.once('close', fn)
		installProcess.kill('SIGINT')
	} else {
		fn()
	}
}

interface InstallResult {
	code: number
	output: string
	signal: string
}

function installSingle(npmCliPath: string, cwd: string, fn: (result: InstallResult) => void) {
	log('begin npm install, npm exectuable: %s', npmCliPath)
	installProcess = fork(npmCliPath, ['update', '--no-package-lock'], {
		execArgv: [],
		silent: true,
		cwd
	})
	const chunks = []
	let chunksLength = 0
	installProcess.stdout.on('data', (chunk) => {
		chunks.push(chunk)
		chunksLength += chunk.length
	})
	installProcess.stderr.on('data', (chunk) => {
		chunks.push(chunk)
		chunksLength += chunk.length
	})
	installProcess.on('close', (code, signal) => {
		const buffer = Buffer.alloc(chunksLength)
		let pos = 0
		for (const chunk of chunks) {
			chunk.copy(buffer, pos)
			pos += chunk.length
		}
		const output = buffer.toString()
		log('npm process closed with code %n, signal %s, output %s', code, signal, output)
		fn({
			code,
			output,
			signal
		})
	})
}
