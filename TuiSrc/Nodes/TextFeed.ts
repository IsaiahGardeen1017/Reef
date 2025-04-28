import { maybeTruncate } from '../../utils/strUtils.ts';
import { TerminalSize } from '../TuiManager.ts';
import { Node } from './Node.ts';
import { centerText } from './NodeFuncs.ts/TextCenterer.ts';

export class TextFeedNode extends Node {
	lines: string[];
	numReq: number;

	constructor(minHeight = 0) {
		super();
		this.lines = [];
		this.numReq = minHeight;
	}

	get minHeight() {
		return this.numReq;
	}

	sendLine(line: string){
		this.lines.push(line);
	}

	clearLines(){
		this.lines = [];
	}

	handleInput(input: Uint8Array<ArrayBuffer>) {
		// This should not get input
	}

	renderStrings(size: TerminalSize): string[] {
		const retStrs = [];
		for(let i = 0; i < size.h; i++){
			if(i < this.lines.length){
				const str = maybeTruncate(this.lines[i], size.w);
				retStrs.push(str);
			}else{
				retStrs.push(''.padEnd(size.w, ' '))
			}
		}
		return retStrs;
	}
}


