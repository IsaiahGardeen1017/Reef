import { TerminalSize } from '../utils/terminalUtils.ts';

export type LayerOptions = {};

export type OutputGrid = {
	items: string[][];
	size: TerminalSize;
};

export function GenEmptyOutputGrid(size: TerminalSize): OutputGrid {
	const newItemsArr: string[][] = [];
	for (let i = 0; i < size.w; i++) {
		const newCol: string[] = [];
		for (let j = 0; j < size.h; j++) {
			newCol.push('');
		}
		newItemsArr.push(newCol);
	}

	return {
		items: newItemsArr,
		size: size,
	};
}

export abstract class Layer {
	constructor(outputGrid: OutputGrid, opts?: LayerOptions) {
	}
}

export function combineGridsToStringList(grids: OutputGrid[]): string[] {
	return [];
}
