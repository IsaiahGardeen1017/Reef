const paths = ['./src/Nodes', './src/Reef.ts'];

let exports: string[] = [];

for (const path of paths) {
	const files = await getAllFilePaths(path);

	files.forEach((file) => {
		exports.push(`export * from '${file}';`);
	});
}

Deno.writeTextFileSync('./mod.ts', exports.join('\n'));

async function getAllFilePaths(inputPath: string): Promise<string[]> {
	const filePaths: string[] = [];

	async function readDirRecursively(currentDir: string) {
		for await (const entry of Deno.readDir(currentDir)) {
			const fullPath = `${currentDir}/${entry.name}`;
			if (entry.isDirectory) {
				await readDirRecursively(fullPath);
			} else {
				filePaths.push(fullPath);
			}
		}
	}

	const stat = await Deno.stat(inputPath);
	if (stat.isDirectory) {
		await readDirRecursively(inputPath);
	} else {
		filePaths.push(inputPath);
	}

	return filePaths;
}
