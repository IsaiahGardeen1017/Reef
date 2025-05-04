import { assert } from '@std/assert/assert';
import { pushNlines } from '../../../utils/strUtils.ts';
import { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';

export type FinalSpacingDetail = {
	topPad: number;
	botPad: number;
	leftPad: number;
	rightPad: number;

	topMargin: number;
	botMargin: number;
	leftMargin: number;
	rightMargin: number;

	topBorderChar: string;
	botBorderChar: string;
	leftBorderChar: string;
	rightBorderChar: string;

	topLeftBorderChar: string;
	topRightBorderChar: string;
	botLeftBorderChar: string;
	botRightBorderChar: string;
};

export abstract class PadBorderMarginBase extends Node {
	child: Node;

	constructor(child: Node, opts?: NodeOptions) {
		super(opts);
		this.child = child;
	}

	abstract calcFinalSpacingDetail(size: TerminalSize): FinalSpacingDetail;

	override renderStrings(size: TerminalSize): string[] {
		const ld = this.calcFinalSpacingDetail(size);
		const totalHieghtAdded = ld.topPad +
			(ld.topBorderChar ? 1 : 0) +
			ld.topMargin +
			ld.botMargin +
			(ld.botBorderChar ? 1 : 0) +
			ld.botPad;
		if (totalHieghtAdded + this.child.minHeight > size.h) {
			throw new Error('I cant deal with this rn');
		}
		const totalWidthAdded = ld.leftPad +
			(ld.leftBorderChar ? 1 : 0) +
			ld.leftMargin +
			ld.rightMargin +
			(ld.rightBorderChar ? 1 : 0) +
			ld.rightPad;

		const finalStrings: string[] = [];

		const childSize: TerminalSize = {
			h: size.h - totalHieghtAdded,
			w: size.w - totalWidthAdded,
		};

		const childStrs = this.child.renderStrings(childSize);

		//Add top pads
		const padStr = p(size.w, ' ');
		pushNlines(finalStrings, padStr, ld.topPad);

		//Add top border
		const renderTopBorder: boolean = (ld.topBorderChar) ? true : false;
		const renderBotBorder: boolean = (ld.botBorderChar) ? true : false;
		const borderLen = size.w - ld.leftPad - ld.rightPad;
		if (renderTopBorder) {
			const topBorderStr = p(ld.leftPad, ' ') + ld.topLeftBorderChar + p(borderLen - 2, ld.topBorderChar) +
				ld.topRightBorderChar + p(ld.rightPad, ' ');
			finalStrings.push(topBorderStr);
		}

		//Child lines
		const leftStr = p(ld.leftPad, ' ') + ld.leftBorderChar + p(ld.leftMargin, ' ');
		const rightStr = p(ld.rightMargin, ' ') + ld.rightBorderChar + p(ld.rightPad, ' ');
		for (let i = 0; i < childStrs.length; i++) {
			const yarskyook = leftStr + childStrs[i] + rightStr;
			//0aassert(yarskyook === 'a', `MESSAGE ||${yarskyook}||`);
			finalStrings.push(leftStr + childStrs[i] + rightStr);
		}

		//Add bottom border
		if (renderBotBorder) {
			const borderLen = size.w - ld.leftPad - ld.rightPad;
			const botBorderStr = p(ld.leftPad, ' ') + ld.botLeftBorderChar + p(borderLen - 2, ld.botBorderChar) +
				ld.botRightBorderChar + p(ld.rightPad, ' ');
			finalStrings.push(botBorderStr);
		}

		//Add bottom pads
		pushNlines(finalStrings, padStr, ld.botPad);

		assert(finalStrings.length === size.h, 'IDIOT - LayerMemberNode IS OUTPUTTING A MISMATCHING HEIGHT');

		for (const str of finalStrings) {
			assert(str.length === size.w, 'IDIOT - LayerMemberNode IS OUTPUTTING A MISMATCHING WIDTH');
		}

		return finalStrings;
	}

	override handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return this.child.handleInput(input);
	}
}

function p(num: number, str = ' ') {
	return ''.padEnd(num, str);
}
