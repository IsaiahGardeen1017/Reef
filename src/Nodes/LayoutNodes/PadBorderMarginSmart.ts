import { createDetails } from 'jsr:@std/internal@^1.0.5/diff-str';
import { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';
import { FinalSpacingDetail, PadBorderMarginBase } from './PadBorderMarginBase.ts';
import { defaultBordering } from '../../Themeing/Theme.ts';
import { pbmBasicDetail } from './PadBorderMarginBasic.ts';
import { assert } from '@std/assert/assert';

export type pbmSmartDetails = Partial<pbmBasicDetail> & {
	boxHeight?: number;
	boxWidth?: number;

	padTopPercent?: number;
	padBotPercent?: number;
	padHeightPercent?: number;

	padLeftPercent?: number;
	padRightPercent?: number;
	padWidthPercent?: number;
};

function getFiniteSpacingDetail(d: pbmSmartDetails, size: TerminalSize): FinalSpacingDetail {
	let topPad = d.topPad || d.vertPad || d.allPad || d.horzPad || 0;
	let botPad = d.botPad || d.vertPad || d.allPad || d.horzPad || 0;
	let leftPad = d.leftPad || d.horzPad || d.allPad || 0;
	let rightPad = d.rightPad || d.horzPad || d.allPad || 0;

	const topMargin = d.topMargin || d.vertMargin || d.allMargin || d.horzMargin || 0;
	const botMargin = d.botMargin || d.vertMargin || d.allMargin || d.horzMargin || 0;
	const leftMargin = d.leftMargin || d.horzMargin || d.allMargin || 0;
	const rightMargin = d.rightMargin || d.horzMargin || d.allMargin || 0;

	//Padding Top/Bottom
	if (d.padHeightPercent) {
		d.padTopPercent = d.padHeightPercent;
		d.padBotPercent = d.padHeightPercent;
	}
	if (d.boxHeight) {
		const rowsTaked = d.boxHeight + 2;
		if (rowsTaked > size.h) {
			//Do nothing?
		} else {
			const leftOver = size.h - d.boxHeight;
			topPad = Math.floor(leftOver / 2);
			botPad = leftOver - topPad;
		}
	} else if (d.padTopPercent || d.padBotPercent) {
		assert((d.padTopPercent || 0) + (d.padBotPercent || 0) < 1, 'Perecent Top and Percent Bottom cant be higher than 1 combined');
		topPad = d.padTopPercent ? Math.floor(d.padTopPercent * size.h) : topPad;
		botPad = d.padBotPercent ? Math.floor(d.padBotPercent * size.h) : topPad;
	}

	//Padding Left/Right
	if (d.padWidthPercent) {
		d.padLeftPercent = d.padWidthPercent;
		d.padRightPercent = d.padWidthPercent;
	}
	if (d.boxWidth) {
		const leftOver = size.w - d.boxWidth;
		leftPad = Math.floor(leftOver / 2);
		rightPad = leftOver - leftPad;
	} else if (d.padLeftPercent || d.padRightPercent) {
		assert((d.padLeftPercent || 0) + (d.padRightPercent || 0) < 1, 'Perecent Top and Percent Bottom cant be higher than 1 combined');
		topPad = d.padLeftPercent ? Math.floor(d.padLeftPercent * size.h) : topPad;
		botPad = d.padRightPercent ? Math.floor(d.padRightPercent * size.h) : topPad;
	}

	//Borders
	const topBorderChar = d.topBorderChar || d.vertBorderChar || d.allBorderChar || defaultBordering.topBorderChar;
	const botBorderChar = d.botBorderChar || d.vertBorderChar || d.allBorderChar || defaultBordering.botBorderChar;
	const leftBorderChar = d.leftBorderChar || d.horzBorderChar || d.allBorderChar || defaultBordering.leftBorderChar;
	const rightBorderChar = d.rightBorderChar || d.horzBorderChar || d.allBorderChar || defaultBordering.rightBorderChar;

	//Corner Borders
	const topLeftBorderChar = d.topLeftBorderChar || d.topBorderChar || d.leftBorderChar || d.horzBorderChar || d.vertBorderChar ||
		d.allBorderChar || defaultBordering.topLeftBorderChar;
	const topRightBorderChar = d.topRightBorderChar || d.topBorderChar || d.rightBorderChar || d.horzBorderChar ||
		d.vertBorderChar || d.allBorderChar || defaultBordering.topRightBorderChar;
	const botLeftBorderChar = d.botLeftBorderChar || d.botBorderChar || d.leftBorderChar || d.horzBorderChar || d.vertBorderChar ||
		d.allBorderChar || defaultBordering.botLeftBorderChar;
	const botRightBorderChar = d.botRightBorderChar || d.botBorderChar || d.rightBorderChar || d.horzBorderChar ||
		d.vertBorderChar || d.allBorderChar || defaultBordering.botRightBorderChar;

	return {
		topPad,
		botPad,
		leftPad,
		rightPad,

		topMargin,
		botMargin,
		leftMargin,
		rightMargin,

		topBorderChar,
		botBorderChar,
		leftBorderChar,
		rightBorderChar,

		topLeftBorderChar,
		topRightBorderChar,
		botLeftBorderChar,
		botRightBorderChar,
	};
}

export class PadBorderMarginSmart extends PadBorderMarginBase {
	layoutDetails: pbmSmartDetails;

	constructor(child: Node, details: pbmSmartDetails, opts?: NodeOptions) {
		super(child, opts);
		this.layoutDetails = details;
	}

	override calcFinalSpacingDetail(size: TerminalSize): FinalSpacingDetail {
		return getFiniteSpacingDetail(this.layoutDetails, size);
	}

	override get minHeight(): number {
		throw new Error('Method not implemented.');
	}
}
