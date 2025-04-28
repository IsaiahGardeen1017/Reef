import { TerminalSize } from '../utils/terminalUtils.ts';
import { GenEmptyOutputGrid, OutputGrid } from './Layer.ts';

export type TextEnteringOptions = {
	size: TerminalSize;
	xOffset: number;
	xWidth: number;
	yOffset: number;
	yWidth: number;
	border?: string;
};

export function textEntering(opts: TextEnteringOptions): OutputGrid {
	const edgingChar = opts.border ? opts.border.charAt(0) : '=';
	const newOutputGrid = GenEmptyOutputGrid(opts.size);
	const x0 = opts.xOffset;
	const w = opts.xWidth + x0;
	const y0 = opts.yOffset;
	const h = opts.yWidth + y0;

	for (let x = x0; x < w; x++) {
		for (let y = y0; y < h; y++) {
			if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
				newOutputGrid.items[x][y] = edgingChar;
			}
		}
	}
	return newOutputGrid;
}
