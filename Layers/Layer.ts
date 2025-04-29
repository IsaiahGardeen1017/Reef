import type { TerminalSize } from '../utils/terminalUtils.ts';

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

export function layerGridsToStringList(grids: OutputGrid[]): string[] {
	const height = grids[0].size.h;
	const width = grids[0].size.w;

	const outputStrs: string[] = [];

	//We boutta nest some loops
	for (let y = 0; y < height; y++) {
		let lineStrArr: string[] = [];

		for (let x = 0; x < width; x++) {
			let char = getCharFromGridsAtCoord(grids, x, y);
			lineStrArr.push(char);
		}

		outputStrs.push(lineStrArr.join(''));
	}
	return outputStrs;
}

function getCharFromGridsAtCoord(grids: OutputGrid[], x: number, y: number) {
	let char = ' ';
	for (let i = 0; i < grids.length; i++) {
		const item = grids[i].items[x][y];
		if (item !== undefined && item !== '') {
			char = item;
		}
	}
	return char;
}
