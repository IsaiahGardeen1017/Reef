import { maybeTruncate } from '../../../utils/strUtils.ts';
import type { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';

export class TextFeedNode extends Node {
	lines: string[];
	numReq: number;

	constructor(minHeight = 0, opts?: NodeOptions) {
		super(opts);
		this.lines = [];
		this.numReq = minHeight;
	}

	get minHeight(): number {
		return this.numReq;
	}

	sendLine(line: string) {
		this.lines.push(line);
	}

	clearLines() {
		this.lines = [];
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return false;
	}

	renderStrings(size: TerminalSize): string[] {
		const retStrs = [];
		for (let i = 0; i < size.h; i++) {
			if (i < this.lines.length) {
				let index = i;
				if (this.lines.length > size.h) {
					index = i + (this.lines.length - size.h);
				}
				const str = maybeTruncate(this.lines[index], size.w);
				retStrs.push(str);
			} else {
				retStrs.push(''.padEnd(size.w, ' '));
			}
		}
		return retStrs;
	}
}
