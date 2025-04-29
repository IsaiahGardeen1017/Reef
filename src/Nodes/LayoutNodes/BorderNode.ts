import { padRepeat } from '../../../utils/strUtils.ts';
import type { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';

export class BorderNode extends Node {
	child: Node;
	char: string;

	constructor(child: Node, borderChar: string, options?: NodeOptions) {
		super(options);
		this.child = child;
		this.char = borderChar.charAt(0);
	}

	get minHeight(): number {
		return this.child.minHeight + 2;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return this.child.handleInput(input);
	}

	renderStrings(size: TerminalSize): string[] {
		const childSize = {
			w: size.w - 2,
			h: size.h - 2,
		};

		const childStrings = this.child.renderStrings(childSize);
		let retStrArr: string[] = [];
		retStrArr.push(padRepeat(this.char, size.w));
		for (let i = 0; i < childStrings.length; i++) {
			retStrArr.push(this.char + childStrings[i] + this.char);
		}
		retStrArr.push(padRepeat(this.char, size.w));
		return retStrArr;
	}
}
