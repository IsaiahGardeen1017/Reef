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

	for (let i = 0; i < startingLine + l; i++) {
		const lineStr = lines[i];
		const x = startingLine + i;
		const charArr = padEqual(lineStr, size.w, '');
		for (let y = 0; y < size.h; y++) {
			newOutputGrid.items[x][y] = charArr[y];
		}
	}
	return newOutputGrid;
}
