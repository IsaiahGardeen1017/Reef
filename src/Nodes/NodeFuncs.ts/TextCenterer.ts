// TODO Rewrite all of this
// TODO Rewrite all of this
// TODO Rewrite all of this
// TODO Rewrite all of this

import { TerminalSize } from '../../Reef.ts';

export function centerText(size: TerminalSize, lines: string[]): string[] {
	const yext = centerTexting(size, lines);
	const grext = layerGridsToStringList([yext]);
	return grext;
}

function centerTexting(size: TerminalSize, lines: string[]): OutputGrid {
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

type OutputGrid = {
	items: string[][];
	size: TerminalSize;
};

function GenEmptyOutputGrid(size: TerminalSize): OutputGrid {
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

function layerGridsToStringList(grids: OutputGrid[]): string[] {
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
