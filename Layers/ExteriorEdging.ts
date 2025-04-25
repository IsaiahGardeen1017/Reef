import { TerminalSize } from '../utils/terminalUtils.ts';
import { GenEmptyOutputGrid, OutputGrid } from './Layer.ts';

//Edging Str can o
export function exteriorEdging(size: TerminalSize, edgingStr = '#'): OutputGrid {
	const edgingChar = edgingStr.charAt(0);
	const newOutputGrid = GenEmptyOutputGrid(size);
	for (let x = 0; x < size.w; x++) {
		for (let y = 0; y < size.h; y++) {
			if (x === 0 || y === 0 || x === size.w - 1 || y === size.h - 1) {
				newOutputGrid.items[x][y] = edgingChar;
			}
		}
	}
	return newOutputGrid;
}
