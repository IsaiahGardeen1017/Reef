import { Node, NodeOptions, TerminalSize } from 'jsr:@igardeen/reef';
import { maybeTruncate } from 'https://jsr.io/@igardeen/reef/0.0.3/utils/strUtils.ts';
import { mapEventToInput } from '../../EventToInput.ts';

export class ScrollableFeedNode extends Node {
	lines: string[];
	numReq: number;
	scrollIndex: number;
	scrolling?: boolean;
	lastHeight: number;

	constructor(minHeight = 0, opts?: NodeOptions) {
		super(opts);
		this.lines = [];
		this.numReq = minHeight;

		/** How far up from normal to render */
		this.scrollIndex = 0;

		this.lastHeight = 10000;
	}

	get minHeight(): number {
		return this.numReq;
	}

	sendLine(line: string) {
		if (this.scrollIndex > 0) {
			this.setScrollIndex(this.scrollIndex + 1);
		}
		this.lines.push(line);
	}

	clearLines() {
		this.lines = [];
	}

	setScrollIndex(num: number) {
		this.scrollIndex = Math.min(Math.max(0, num), this.lines.length - (this.lastHeight - 1));
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		const pageAmound = Math.floor(this.lastHeight - 1);
		switch (mapEventToInput(input)) {
			case 'ARROWDOWN':
				if (this.lines.length > this.lastHeight) {
					this.setScrollIndex(this.scrollIndex - 1);
				}
				break;
			case 'ARROWUP':
				if (this.lines.length > this.lastHeight) {
					this.setScrollIndex(this.scrollIndex + 1);
				}
				break;
			case 'PAGEDOWN':
				if (this.lines.length > this.lastHeight) {
					this.setScrollIndex(this.scrollIndex - pageAmound);
				}
				break;
			case 'PAGEUP':
				if (this.lines.length > this.lastHeight) {
					this.setScrollIndex(this.scrollIndex + pageAmound);
				}
				break;
			case 'HOME':
				this.scrollIndex = 0;
				break;
			default:
				return false;
		}
		return true;
	}

	renderStrings(size: TerminalSize): string[] {
		this.lastHeight = size.h;

		let startIndex = this.lines.length - size.h - this.scrollIndex;

		const retStrs = [];
		for (let i = 0; i < size.h; i++) {
			let index = i + startIndex;
			if (this.lines[index]) {
				const str = maybeTruncate(this.lines[index], size.w);
				retStrs.push(str);
			} else {
				retStrs.push(''.padEnd(size.w, ' '));
			}
		}
		return retStrs;
	}

	override notifySelectedStatus(isSelected: boolean): boolean {
		return false;
	}
}
