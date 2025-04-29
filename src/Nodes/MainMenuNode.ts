import { centerHorizontal, padEqual, type padRepeat } from '../../utils/strUtils.ts';
import type { TerminalSize } from '../Reef.ts';
import { Node } from './Node.ts';

export type MainMenuEntry = {
	node: Node;
	title: string;
	letter: string;
};

export class MainMenuNode extends Node {
	title: string;
	entries: MainMenuEntry[];
	selected: undefined | Node;
	rerender: () => any;

	constructor(rerenderFunc: () => any, title: string, entries: MainMenuEntry[]) {
		super();
		this.rerender = rerenderFunc;
		this.title = title;
		this.entries = entries ? entries : [];
	}

	get minHeight(): number {
		return this.entries.length + 2;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		if (this.selected) {
			if (this.selected.handleInput(input)) {
				return true;
			}

			const eventCode = input[0];
			if (eventCode === 27) {
				if (input.length === 1) {
					this.selected = undefined;
				}
				this.rerender();
				return true;
			}
		}

		const chunk = new TextDecoder().decode(input).toLowerCase();
		const found = this.entries.find((entry) => {
			return chunk === entry.letter.toLowerCase();
		});

		if (found) {
			this.selected = found.node;
			this.rerender();
			return true;
		}

		return false;
	}

	renderStrings(size: TerminalSize): string[] {
		if (this.selected) {
			return this.selected.renderStrings(size);
		} else {
			let centeringWidth = this.title.length;

			const lines = [this.title, ''.padEnd(size.w, ' ')];
			for (const e of this.entries) {
				const str = `[${e.letter}] - ${e.title}`;
				lines.push(str);

				if (str.length > centeringWidth) {
					centeringWidth = str.length;
				}
			}
			const allLinesRaw = centerHorizontal(lines, size.h);

			//Center only title
			allLinesRaw[0] = padEqual(allLinesRaw[0], centeringWidth);

			let finalLines: string[] = [];
			for (const rl of allLinesRaw) {
				finalLines.push(padEqual(rl, size.w));
			}
			return finalLines;
		}
	}
}
