import { padRepeat } from '../../utils/strUtils.ts';
import { TerminalSize } from '../Reef.ts';
import { Node } from './Node.ts';

export class PaddingNode extends Node {
	child: Node;
	xPad: number;
	yPad: number;
	padChar: string;

	constructor(child: Node, xPadAmount: number, yPadAmount: number, padChar = ' ') {
		super();
		this.child = child;
		this.yPad = Math.floor(xPadAmount);
		this.xPad = Math.floor(yPadAmount);
		this.padChar = padChar.charAt(0);
	}

	get minHeight(): number {
		return this.child.minHeight;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return this.child.handleInput(input);
	}

	renderStrings(size: TerminalSize): string[] {
		const yPadReductionNeeded = Math.max(this.minHeight + (this.yPad * 2) - size.h, 0);

		const childSize = {
			w: size.w - (this.xPad * 2),
			h: size.h - (this.yPad * 2) + yPadReductionNeeded,
		};

		const topReductionNeeded = Math.ceil(yPadReductionNeeded / 2);
		const botReductionNeeded = yPadReductionNeeded - topReductionNeeded;

		const childStrings = this.child.renderStringsSafe(childSize);
		let retStrArr: string[] = [];
		for (let i = 0 + topReductionNeeded; i < this.yPad; i++) {
			retStrArr.push(padRepeat(this.padChar, size.w));
		}
		for (let i = 0; i < childStrings.length; i++) {
			const p = padRepeat(this.padChar, this.xPad);
			retStrArr.push(p + childStrings[i] + p);
		}
		for (let i = 0 + botReductionNeeded; i < this.yPad; i++) {
			retStrArr.push(padRepeat(this.padChar, size.w));
		}
		return retStrArr;
	}
}
