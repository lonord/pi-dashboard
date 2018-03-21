export default function clearModule(path: string) {
	const cachedModules = require.cache
	const namesToDelete: string[] = []
	for (const name in cachedModules) {
		if (name.startsWith(path)) {
			namesToDelete.push(name)
		}
	}
	for (const name of namesToDelete) {
		const m = require.cache[name]
		for (let i = 0; i < m.parent.children.length; i++) {
			const cm = m.parent.children[i]
			if (cm.filename === name) {
				m.parent.children.splice(i, 1)
				break
			}
		}
		delete require.cache[name]
	}
}
