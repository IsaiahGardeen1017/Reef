import { padRepeat } from '../../../utils/strUtils.ts';
import type { TerminalSize } from '../../Reef.ts';
import type { BorderNode } from '../LayoutNodes/BorderNode.ts';
import { Node, NodeOptions } from '../Node.ts';
import { AutoCompleter, InputNode, ListenerFunction } from './InputNode.ts';

export type TextInputOptions = NodeOptions & {
	label?: string;
	autoCompleter?: AutoCompleter;
};

export class TextInputNode extends InputNode<string, TextInputOptions> {
	beforeCurser: string;
	afterCurser: string;
	selected: boolean;

	constructor(listeners?: ListenerFunction<string>[], opts?: TextInputOptions) {
		super(listeners, opts);
		this.beforeCurser = '';
		this.afterCurser = '';
		this.selected = false;
	}

	override notifySelectedStatus(isSelected: boolean): boolean {
		this.selected = isSelected;
		return true;
	}

	addToCurrentText(t: string) {
		this.beforeCurser += t;
	}

	clearText() {
		this.beforeCurser = '';
		this.afterCurser = '';
	}

	get minHeight(): number {
		return this.calcMinHeight(1);
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		let used = false;
		if (input) {
			const eventCode = input[0];
			switch (eventCode) {
				case 127: //Backspace
					this.beforeCurser = this.beforeCurser.substring(0, Math.max(this.beforeCurser.length - 1, 0));
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
					this.notifyListeneres(this.beforeCurser + this.afterCurser);
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
		return used;
	}

	renderStrings(size: TerminalSize): string[] {
		if (size.h < 1) {
			return [];
		}

		let retStrArr: string[] = [];

		const selToRender = this.opts.label || '>';
		const label = this.selected ? selToRender : ''.padEnd(selToRender.length, ' ');

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

		retStrArr[0] = textLineStr;

		return retStrArr;
	}
}
