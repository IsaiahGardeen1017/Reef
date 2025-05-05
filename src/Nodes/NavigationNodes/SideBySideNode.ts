import { mapEventToInput } from '../../EventToInput.ts';
import { TerminalSize } from '../../Reef.ts';
import { ScrollableFeedNode } from '../ioNodes/ScrollableFeedNode.ts';
import { Node, NodeOptions } from '../Node.ts';

export type SideBySideOptions = NodeOptions & {
	splitChar?: string;
	selectedStr?: string;
	repeatSelectedStr?: boolean;
};

export class SideBySideSelectable extends Node {
	/** True for left, False for right */
	focusedLeft: boolean;
	leftChild: Node;
	rightChild: Node;

	splitChar: string;
	selectedStr: string;
	repeatSelected: boolean;

	constructor(leftNode: Node, rightNode: Node, opts?: SideBySideOptions) {
		super(opts);
		this.focusedLeft = true;
		this.rightChild = rightNode;
		this.leftChild = leftNode;
		this.splitChar = opts?.splitChar || '|';
		this.selectedStr = opts?.selectedStr || '=';
		this.repeatSelected = opts?.repeatSelectedStr || false;
	}

	override get minHeight(): number {
		return this.calcMinHeight(Math.max(this.leftChild.minHeight, this.rightChild.minHeight) + 1);
	}

	override renderStrings(size: TerminalSize): string[] {
		const leftWidth = Math.floor(size.w / 2);
		const rightWidth = size.w - leftWidth - 1;
		const childHeight = size.h - 1;

		let lastStr;
		if (this.focusedLeft) {
			lastStr = this.getSelectedChildSubStr(this.leftChild, leftWidth) + this.splitChar +
				this.getUnselectedChildSubStr(this.rightChild, rightWidth);
		} else {
			lastStr = this.getUnselectedChildSubStr(this.leftChild, leftWidth) + this.splitChar +
				this.getSelectedChildSubStr(this.rightChild, rightWidth);
		}

		const leftStrs = this.leftChild.renderStrings({ h: childHeight, w: leftWidth });
		const rightStrs = this.rightChild.renderStrings({ h: childHeight, w: rightWidth });

		let finalStrs = [];
		for (let i = 0; i < childHeight; i++) {
			finalStrs.push(leftStrs[i] + this.splitChar + rightStrs[i]);
		}

		finalStrs.push(lastStr);

		return finalStrs;
	}

	notifySelectedStatus(isSelected: boolean): boolean {
		return false;
	}

	getSelectedChildSubStr(child: Node, width: number) {
		let args = child.getArgumentHints();
		const resp = child.notifySelectedStatus(true);
		const fillStr = this.repeatSelected ? this.selectedStr : ' ';
		const firestChar = resp ? ' ' : this.selectedStr;
		let pot = firestChar + (args.join(this.selectedStr) + ''.padEnd(3, fillStr)).padStart(width - 1, fillStr);
		return pot.length > width ? ''.padEnd(width, fillStr) : pot;
	}
	getUnselectedChildSubStr(child: Node, width: number) {
		child.notifySelectedStatus(false);
		return ''.padEnd(width, ' ');
	}

	override handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		switch (mapEventToInput(input)) {
			case this.splitChar.toLocaleLowerCase():
			case this.splitChar.toLocaleUpperCase():
				//Toggle
				break;
			case 'TAB':
				this.focusedLeft = !this.focusedLeft;
				break;
			default:
				return this.focusedLeft ? this.leftChild.handleInput(input) : this.rightChild.handleInput(input);
		}
		return true;
	}
}
