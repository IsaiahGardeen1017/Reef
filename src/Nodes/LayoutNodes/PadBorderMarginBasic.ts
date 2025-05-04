import { assert } from '@std/assert/assert';
import { pushNlines } from '../../../utils/strUtils.ts';
import { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';
import { FinalSpacingDetail, PadBorderMarginBase } from './PadBorderMarginBase.ts';

export type pbmBasicDetail = Partial<
	FinalSpacingDetail & {
		horzPad: number;
		vertPad: number;
		allPad: number;

		vertMargin: number;
		horzMargin: number;
		allMargin: number;

		vertBorderChar: string;
		horzBorderChar: string;
		allBorderChar: string;
	}
>;

function getFiniteSpacingDetail(li: pbmBasicDetail): FinalSpacingDetail {
	return {
		topPad: li.topPad || li.vertPad || li.allPad || li.horzPad || 0,
		botPad: li.botPad || li.vertPad || li.allPad || li.horzPad || 0,
		leftPad: li.leftPad || li.horzPad || li.allPad || 0,
		rightPad: li.rightPad || li.horzPad || li.allPad || 0,

		topMargin: li.topMargin || li.vertMargin || li.allMargin || li.horzMargin || 0,
		botMargin: li.botMargin || li.vertMargin || li.allMargin || li.horzMargin || 0,
		leftMargin: li.leftMargin || li.horzMargin || li.allMargin || 0,
		rightMargin: li.rightMargin || li.horzMargin || li.allMargin || 0,

		topBorderChar: li.topBorderChar || li.vertBorderChar || li.allBorderChar || li.horzBorderChar || '',
		botBorderChar: li.botBorderChar || li.vertBorderChar || li.allBorderChar || li.horzBorderChar || '',
		leftBorderChar: li.leftBorderChar || li.horzBorderChar || li.allBorderChar || '',
		rightBorderChar: li.rightBorderChar || li.horzBorderChar || li.allBorderChar || '',

		topLeftBorderChar: li.topLeftBorderChar || li.topBorderChar || li.leftBorderChar || li.horzBorderChar || li.vertBorderChar ||
			li.allBorderChar || '',
		topRightBorderChar: li.topRightBorderChar || li.topBorderChar || li.rightBorderChar || li.horzBorderChar || li.vertBorderChar ||
			li.allBorderChar || '',
		botLeftBorderChar: li.botLeftBorderChar || li.botBorderChar || li.leftBorderChar || li.horzBorderChar || li.vertBorderChar ||
			li.allBorderChar || '',
		botRightBorderChar: li.botRightBorderChar || li.botBorderChar || li.rightBorderChar || li.horzBorderChar || li.vertBorderChar ||
			li.allBorderChar || '',
	};
}

export class PadBorderMarginBasic extends PadBorderMarginBase {
	layoutDetails: FinalSpacingDetail;

	constructor(child: Node, layoutDetails: pbmBasicDetail, opts?: NodeOptions) {
		super(child, opts);
		this.child = child;
		this.layoutDetails = getFiniteSpacingDetail(layoutDetails);
	}

	override calcFinalSpacingDetail(size: TerminalSize): FinalSpacingDetail {
		return this.layoutDetails;
	}

	override get minHeight(): number {
		const ld = this.layoutDetails;
		const totalHieghtAdded = ld.topPad +
			(ld.topBorderChar ? 1 : 0) +
			ld.topMargin +
			ld.botMargin +
			(ld.botBorderChar ? 1 : 0) +
			ld.botPad;
		return this.child.minHeight + totalHieghtAdded;
	}

	override handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return this.child.handleInput(input);
	}
}

function p(num: number, str = ' ') {
	return ''.padEnd(num, str);
}
