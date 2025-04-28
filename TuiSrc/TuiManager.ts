import { InputManagaer } from './InputManger.ts';
import { CenteredTextNode } from './Nodes/CenteredTextNode.ts';
import { HomeNode } from './Nodes/HomeNode.ts';
import { Node } from './Nodes/Node.ts';

export type TuiManagerOptions = {
	fps: number;
};

export class TuiManager {
	redraw = true;
	homeNode?: HomeNode;
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
	};

	exitApplication() {
		Deno.stdin.setRaw(false);
		Deno.exit(0); // Exit the program
	}

	async start() {
		if (!this.homeNode) {
			throw Error('TuiManager needs node to work');
		}

		Deno.stdin.setRaw(true);

		let lastSize = getTerminalSize();
		await renderScreen(lastSize, this.homeNode);

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

async function renderScreen(size: TerminalSize, homeNode: HomeNode) {
	let nodeToRender: Node = homeNode;

	if (size.h < homeNode.minHeight) {
		nodeToRender = new CenteredTextNode(['MAKE TERMINAL BIGGER'], 1);
	}

	const textRows = nodeToRender.renderStrings(size);
	const encoder = new TextEncoder();
	console.clear();
	await Deno.stdout.write(encoder.encode('\x1b[2J\x1b[H'));
	for (const line of textRows) {
		await Deno.stdout.write(encoder.encode('\n' + line));
	}
}
