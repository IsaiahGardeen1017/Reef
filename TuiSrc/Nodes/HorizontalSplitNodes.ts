import { padRepeat } from '../../utils/strUtils.ts';
import { TerminalSize } from '../TuiManager.ts';
import { Node } from './Node.ts';

export class HorizontalSplitNode extends Node {
	top: Node;
	bot: Node;
	split: number;
	splitStr?: string;

	constructor(topNode: Node, botNode: Node, percentTop = .5, splitStr?: string) {
		if (percentTop >= 1) {
			throw Error('IDIOT DEVELOPER!, you cannot pass a value higher than 1 into HorizontalSplitNode constructor!');
		}
		super();
		this.split = percentTop;
		this.splitStr = splitStr;
		this.top = topNode;
		this.bot = botNode;
	}

	get minHeight() {
		const children = this.top.minHeight + this.bot.minHeight;
		return this.splitStr ? children + 1 : children;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return false;
	}

	renderStrings(size: TerminalSize): string[] {
		const topH = Math.ceil(size.h * this.split);

		const topSize = {
			h: topH - (this.splitStr ? 1 : 0),
			w: size.w,
		};

		const botSize = {
			h: size.h - topH,
			w: size.w,
		};

		const topRendered = this.top.renderStrings(topSize);
		const splitter = this.splitStr ? [padRepeat(this.splitStr, size.w)] : [];
		const botRendered = this.bot.renderStrings(botSize);

		return topRendered.concat(splitter, botRendered);
	}
}

export class HorizontalSplitNodeTopInput extends HorizontalSplitNode {
	override handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		console.log('top input');
		return this.top.handleInput(input);
	}
}

export class HorizontalSplitNodeBottomInput extends HorizontalSplitNode {
	override handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		console.log('bot input');
		return this.bot.handleInput(input);
	}
}
