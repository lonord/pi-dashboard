export default function requireWithoutCache(fullPath: string) {
	let m = null
	try {
		m = require(fullPath)
		clearModule(fullPath)
	} catch (err) {
		console.error(`load module '${fullPath}' error: ${err.message}`)
	}
	return m
}

function clearModule(path: string) {
	const cachedModules = require.cache
	let nameToDelete: string = null
	for (const name in cachedModules) {
		if (name.startsWith(path)) {
			nameToDelete = name
			break
		}
	}
	if (nameToDelete) {
		delete require.cache[nameToDelete]
	}
}
