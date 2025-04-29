import { centerText } from '../../NodeFuncs/TextCenterer.ts';
import type { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';

export class CenteredTextNode extends Node {
	lines: string[];
	numReq: number;

	constructor(lines: string[], minHeight = 0, opts?: NodeOptions) {
		super(opts);
		this.lines = lines;
		this.numReq = minHeight;
	}

	get minHeight(): number {
		return this.numReq;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return false;
	}

	renderStrings(size: TerminalSize): string[] {
		return centerText(size, this.lines);
	}
}
