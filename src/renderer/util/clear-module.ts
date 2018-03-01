export default function clearModule(path: string) {
	const cachedModules = require.cache
	const namesToDelete: string[] = []
	for (const name in cachedModules) {
		if (name.startsWith(path)) {
			namesToDelete.push(name)
		}
	}
	for (const name of namesToDelete) {
		delete require.cache[name]
	}
}
