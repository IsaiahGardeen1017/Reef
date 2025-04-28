import { padRepeat } from '../../utils/strUtils.ts';
import { TerminalSize } from '../Reef.ts';
import { BorderNode } from './BorderNode.ts';
import { Node } from './Node.ts';

export type TextInputOpts = {
	label?: string;
	autoCompleter?: AutoCompleter;
};

export type AutoCompleter = (text: string) => string[];

export class TextInputNode extends Node {
	beforeCurser: string;
	afterCurser: string;
	opts: TextInputOpts;
	listeners: ((str: string) => any)[];
	rerender: () => any;

	constructor(rerenderFunc: () => any, options: TextInputOpts) {
		super();
		this.opts = options;
		this.beforeCurser = '';
		this.afterCurser = '';
		this.listeners = [];
		this.rerender = rerenderFunc;
	}

	getIncomingKeys() {}

	addToCurrentText(t: string) {
		this.beforeCurser += t;
	}

	clearText() {
		this.beforeCurser = '';
		this.afterCurser = '';
	}

	get minHeight() {
		return 1;
	}

	addListeningFunc(func: (str: string) => any) {
		this.listeners.push(func);
	}

	protected callAllListeneres(arg: string) {
		for (let i = 0; i < this.listeners.length; i++) {
			this.listeners[i](arg);
		}
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		let used = false;
		if (input) {
			const eventCode = input[0];
			switch (eventCode) {
				case 127: //Backspace
					this.beforeCurser = this.beforeCurser.substring(0, Math.max(this.beforeCurser.length - 2, 0));
					used = true;
					break;
				case 27:
					// Del, arrows
					switch (input[2]) {
						case 51: //Delete
							if (this.afterCurser.length > 1) {
								this.afterCurser = this.afterCurser.substring(1, this.afterCurser.length - 1);
							}
							used = true;
							break;
						default:
							//Do nothing
					}
					break;
				case 13: // Enter
					this.callAllListeneres(this.beforeCurser + this.afterCurser);
					this.clearText();
					used = true;
					break;
				default: {
					const chunk = new TextDecoder().decode(input);
					this.beforeCurser = this.beforeCurser + chunk;
					used = true;
					break;
				}
			}
		}
		this.rerender();
		return used;
	}

	renderStrings(size: TerminalSize): string[] {
		if (size.h < 1) {
			return [];
		}

		let retStrArr: string[] = [];

		const label = this.opts.label || '> ';

		const empty = padRepeat(' ', size.w);
		for (let i = 0; i < size.h; i++) {
			retStrArr.push(empty);
		}

		let textLineStr = `${label}${this.beforeCurser}${this.afterCurser}`;
		if (textLineStr.length > size.w) {
			textLineStr = textLineStr.substring(0, textLineStr.length - 1);
		} else if (textLineStr.length < size.w) {
			textLineStr = textLineStr + padRepeat(' ', size.w - textLineStr.length);
		}

		const midIndex = size.h === 1 ? 0 : 1;
		retStrArr[midIndex] = textLineStr;

		return retStrArr;
	}
}
