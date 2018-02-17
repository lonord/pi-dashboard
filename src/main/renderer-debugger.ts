import { spawn } from 'child_process'

export default (onBuildSuccess: () => void) => {
	const child = spawn('./node_modules/.bin/tsc', ['-w', '-p', 'tsconfig.renderer.json'])
	let buildSuccess = false
	child.stdout.on('data', (msg) => {
		console.info(msg.toString())
		if (!buildSuccess) {
			buildSuccess = true
			onBuildSuccess()
		}
	})
	child.stderr.on('data', (msg) => {
		console.error(msg.toString())
	})
	child.on('close', (code, signal) => {
		if (signal === 'SIGINT' || signal === 'SIGTERM') {
			process.exit(0)
		} else {
			console.log(`tsc watch process exited with code ${code}`)
		}
	})
}
