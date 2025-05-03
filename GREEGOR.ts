import { ProcessRunner } from './mtFuncsDEL/newProcessRunner.ts';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

await Deno.stdin.setRaw(true);

async function readInput() {
	const buffer = new Uint8Array(1);
	while (true) {
		Deno.stdin.setRaw(true);
		console.log(`You typed:`);
		const n = await Deno.stdin.read(buffer);
		if (n === null) break;
		const char = decoder.decode(buffer);
		console.log(`${char}`);
	}
	console.log('ITS OVER');
}
readInput();

//**

const dir = undefined;
const cmd = ['C:\\Program Files\\Git\\bin\\bash.exe', './example.sh'];
const processRunner = new ProcessRunner(cmd, dir, (y) => {
	console.log(`Yout: ${y}`);
});

console.log('STARTING');
processRunner.start();
await delay(10);
console.log('STOPPING');
await processRunner.stop();

console.log('OVER');
//*/

Deno.stdin.setRaw(true);

async function delay(secs: number) {
	return await new Promise((resolve) => setTimeout(resolve, 1000 * secs));
}
