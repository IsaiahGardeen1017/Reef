import { padRepeat } from '../../../utils/strUtils.ts';
import type { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';

export type HorizontalSplitNodeOptions = NodeOptions & {
	percentTop?: number;
	splitStr?: string;
};

export class HorizontalSplitNode extends Node<HorizontalSplitNodeOptions> {
	top: Node;
	bot: Node;
	split: number;
	splitStr?: string;

	constructor(topNode: Node, botNode: Node, opts?: HorizontalSplitNodeOptions) {
		super(opts);
		if (opts?.percentTop && opts.percentTop >= 1) {
			throw Error('IDIOT DEVELOPER!, you cannot pass a value higher than 1 into HorizontalSplitNode constructor!');
		}
		this.split = opts?.percentTop || 0.5;
		this.splitStr = opts?.splitStr || ' ';
		this.top = topNode;
		this.bot = botNode;
	}

	get minHeight(): number {
		const children = this.top.minHeight + this.bot.minHeight;
		return this.calcMinHeight(this.splitStr ? children + 1 : children);
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
		return this.top.handleInput(input);
	}
}

export class HorizontalSplitNodeBottomInput extends HorizontalSplitNode {
	override handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return this.bot.handleInput(input);
	}
}
