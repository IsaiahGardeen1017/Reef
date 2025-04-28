import { grog } from '../utils/grog.ts';
import { padEqual } from '../utils/strUtils.ts';
import { TerminalSize } from '../utils/terminalUtils.ts';
import { GenEmptyOutputGrid, OutputGrid } from './Layer.ts';

//Edging Str can o
export function centerTexting(size: TerminalSize, lines: string[]): OutputGrid {
	const newOutputGrid = GenEmptyOutputGrid(size);

	const h = size.h;
	const l = lines.length;
	const b = h - l;
	const startingLine = Math.floor(b / 2);

	for (let i = 0; i < l; i++) {
		const lineStr = lines[i];
		const numBlank = size.w - lineStr.length;
		const strStartIndex = Math.floor(numBlank / 2);
		const blankStartIndex = strStartIndex + lineStr.length;

		for (let x = 0; x < size.w; x++) {
			if (x < strStartIndex) {
				newOutputGrid.items[x][startingLine + i] = '';
			} else if (x < blankStartIndex) {
				newOutputGrid.items[x][startingLine + i] = lineStr.charAt(x - strStartIndex);
			} else {
				newOutputGrid.items[x][startingLine + i] = '';
			}
		}
	}
	return newOutputGrid;
}
