const cp = require('child_process')
const path = require('path')

const child = cp.spawn('./node_modules/.bin/tsc', ['-w', '-p', 'tsconfig.renderer.json'], {
	cwd: path.join(__dirname, '..'),
	stdio: 'inherit'
})
child.on('close', code => {
	process.exit(code)
})
