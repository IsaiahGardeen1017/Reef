Deno.stdin.setRaw(true);

function exitApplication() {
	Deno.exit(0);
}

Deno.addSignalListener('SIGINT', () => {
	console.log(`Exiting with SIGINT`);
	exitApplication();
});

const keyPressListener = async () => {
	for await (const event of Deno.stdin.readable) {
		const eventCode = event[0];
		const chunk = new TextDecoder().decode(event);
		console.log(event);
		console.log(eventCode);
		console.log(chunk);
		if (chunk === '') {
			console.log('NOTHING');
		}
		if (chunk === 'q') {
			exitApplication();
		}
	}
};

// Start listening for key presses in a separate task.
keyPressListener();
