import type { InputManagaer } from './InputManger.ts';
import { CenteredTextNode } from './Nodes/CenteredTextNode.ts';
import { HomeNode } from './Nodes/HomeNode.ts';
import type { Node } from './Nodes/Node.ts';

export type ReefInstanceOptions = {
	fps: number;
};

const encoder = new TextEncoder();
let DEL_frame = 0;

export class ReefInstance {
	redraw = true;
	homeNode?: HomeNode;
	inAlternateBuffer = false;

	constructor(node?: Node) {
		if (node) {
			this.setMainNode(node);
		}
	}

	setMainNode(node: Node) {
		this.homeNode = new HomeNode(node, this.exitApplication);
	}

	rerender = () => {
		this.redraw = true;
		return;
	};

	async exitApplication() {
		this.exitAlternateBuffer();
		await Deno.stdout.write(encoder.encode('\x1b[?25h'));
		Deno.stdin.setRaw(false);
		Deno.exit(0); // Exit the program
	}

	async enterAlternateBuffer() {
		if (!this.inAlternateBuffer) {
			// \x1b[?1049h - Enter alternate screen buffer and clear the screen
			await Deno.stdout.write(encoder.encode('\x1b[?1049h'));
			this.inAlternateBuffer = true;
		}
	}

	async exitAlternateBuffer() {
		if (this.inAlternateBuffer) {
			// \x1b[?1049l - Exit alternate screen buffer and restore the original content
			await Deno.stdout.write(encoder.encode('\x1b[?1049l'));
			this.inAlternateBuffer = false;
		}
	}

	async start() {
		if (!this.homeNode) {
			throw Error('TuiManager needs node to work');
		}

		Deno.stdin.setRaw(true);
		this.enterAlternateBuffer();

		let lastSize = getTerminalSize();

		Deno.addSignalListener('SIGINT', () => {
			this.exitApplication();
		});

		const keyPressListener = async () => {
			for await (const event of Deno.stdin.readable) {
				const eventCode = event[0];
				if (eventCode === 3) {
					this.exitApplication();
				} else {
					this.homeNode?.handleInput(event);
				}
			}
		};

		// Start listening for key presses in a separate task.
		keyPressListener();

		while (true) {
			await new Promise((resolve) => setTimeout(resolve, 16));

			const newSize = getTerminalSize();
			if (newSize.h !== lastSize.h || newSize.w !== lastSize.w) {
				console.clear();
				await Deno.stdout.write(encoder.encode('\x1b[2J\x1b[3J\x1b[H'));
				this.redraw = true;
			}
			if (this.redraw) {
				await renderScreen(newSize, this.homeNode);
				lastSize = newSize;
				this.redraw = false;
			}
		}
	}

	sendInputTo() {
	}
}

export type TerminalSize = {
	h: number;
	w: number;
};

export function getTerminalSize(): TerminalSize {
	const { columns, rows } = Deno.consoleSize();
	return { w: columns, h: rows };
}

async function renderScreenOld(size: TerminalSize, homeNode: HomeNode) {
	let nodeToRender: Node = homeNode;

	if (size.h < homeNode.minHeight) {
		nodeToRender = new CenteredTextNode(['MAKE TERMINAL BIGGER'], 1);
	}

	const textRows = nodeToRender.renderStrings(size);
	console.clear();
	await Deno.stdout.write(encoder.encode('\x1b[2J\x1b[H'));
	for (const line of textRows) {
		await Deno.stdout.write(encoder.encode('\n' + line));
	}
}

async function renderScreen(size: TerminalSize, homeNode: HomeNode) {
	DEL_frame++;
	let nodeToRender: Node = homeNode;

	if (size.h < homeNode.minHeight) {
		nodeToRender = new CenteredTextNode(['MAKE TERMINAL BIGGER']); // Adjust minWidth as needed
	}

	const textRows = nodeToRender.renderStrings(size);
	const encoder = new TextEncoder();

	// Use ANSI escape codes to move cursor to top-left (1,1) and overwrite lines
	// \x1b[H - Move cursor to home position (1,1)
	await Deno.stdout.write(encoder.encode('\x1b[H'));

	for (let i = 0; i < textRows.length; i++) {
		const line = textRows[i];
		// \x1b[K - Erase to end of line
		// \x1b[<row>;<col>H - Move cursor to row, col
		// We move to the beginning of the current row (i + 1, as ANSI is 1-indexed)
		await Deno.stdout.write(encoder.encode(`\x1b[K\x1b[${i + 1};1H${line}`));
	}

	// If the new content is shorter than the previous content, clear the remaining lines
	// This is a bit more complex as you'd need to know the previous height.
	// For simplicity in this example, we'll just make sure we write enough
	// lines to cover the terminal height based on the new content.
	// The `renderStrings` function is modified to pad with empty lines.

	// Move cursor to the end of the rendered content or bottom of the terminal
	await Deno.stdout.write(encoder.encode('\x1b[H'));
	await Deno.stdout.write(encoder.encode('\x1b[?25l'));
}

async function delay() {
	return await new Promise((resolve) => setTimeout(resolve, 500));
}
