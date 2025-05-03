import { mapEventToInput } from './src/EventToInput.ts';

const keyPressListener = async () => {
	try {
		for await (const event of Deno.stdin.readable) {
			const eventCode = event[0];
			if (eventCode === 3) {
				await Deno.stdin.setRaw(false);
				Deno.exit();
			}
			console.log(`event: ${event}`);
			console.log(`input: ${mapEventToInput(event)}`);
		}
	} catch (error) {
		console.log('SERIOUS ERROR! in key press listener: ' + error);
	}
};

await Deno.stdin.setRaw(true);
keyPressListener();
