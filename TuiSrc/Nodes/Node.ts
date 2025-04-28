import { TerminalSize } from '../TuiManager.ts';

export abstract class Node {
	abstract renderStrings(size: TerminalSize): string[];

	abstract get minHeight(): number;

	/**
	 * When input arrives at node (Typically just one key at a time) the node can either do something with the input or send it to a child
	 */
	abstract handleInput(input: Uint8Array<ArrayBuffer>): void;

	renderStringsSafe(size: TerminalSize): string[] {
		if (size.h === 0) {
			return [];
		}
		let renderedStrs = this.renderStrings(size);
		if (renderedStrs.length > size.h) {
			renderedStrs = renderedStrs.slice(0, size.h);
		}

		for (let i = 0; i < renderedStrs.length; i++) {
			if (renderedStrs[i].length > size.w) {
				renderedStrs[i] = renderedStrs[i].substring(0, size.w - 1);
			}
		}

		return renderedStrs;
	}
}
