import { ChildProcess, fork } from 'child_process'
import { writeFile } from 'fs'
import { getInstalledPath } from 'get-installed-path'
import { join } from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(writeFile)

let installProcess: ChildProcess = null

export default async function npmInstall(modules: string[], destDir: string) {
	const pkgDep = {
		dependencies: {}
	}
	for (const m of modules) {
		pkgDep.dependencies[m] = '*'
	}
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
	if (installProcess && !installProcess.killed) {
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
	installProcess = fork(npmCliPath, ['install', '--no-package-lock'], {
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
		fn({
			code,
			output: buffer.toString(),
			signal
		})
	})
}
