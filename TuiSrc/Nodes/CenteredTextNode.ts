import { TerminalSize } from '../TuiManager.ts';
import { Node } from './Node.ts';
import { centerText } from './NodeFuncs.ts/TextCenterer.ts';

export class CenteredTextNode extends Node {
	lines: string[];
	numReq: number;

	constructor(lines: string[], minHeight = 0) {
		super();
		this.lines = lines;
		this.numReq = minHeight;
	}

	get minHeight() {
		return this.numReq;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return false;
	}

	renderStrings(size: TerminalSize): string[] {
		return centerText(size, this.lines);
	}
}
