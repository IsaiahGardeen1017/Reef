import { mapEventToInput } from '../../EventToInput.ts';
import { TerminalSize } from '../../Reef.ts';
import { NodeOptions, Node } from '../Node.ts';


export type SideBySideOptions = NodeOptions & {
	splitChar: string;
	toggleKey: string;
	selectedStr: string;
}

export class SideBySideSelectable extends Node {
    /** True for left, False for right */
	focusedLeft: boolean;
	leftChild: Node;
	rightChild: Node;

	splitChar: string;
	toggleKey: string;
	selectedStr: string;


	constructor(leftNode: Node, rightNode: Node, opts?: SideBySideOptions){
		super(opts);
		this.focusedLeft = true;
		this.rightChild = rightNode;
		this.leftChild = leftNode;
		this.splitChar = opts?.splitChar || '|';
		this.toggleKey = opts?.toggleKey || 't';
		this.selectedStr = opts?.selectedStr || '=';
	}
    
    override get minHeight(): number {
        return this.calcMinHeight(Math.max(this.leftChild.minHeight, this.rightChild.minHeight) + 1);
    }


	override renderStrings(size: TerminalSize): string[] {
		const leftWidth = Math.floor(size.w / 2);
		const rightWidth = size.w - leftWidth - 1;
		const childHeight = size.h - 1;
		
		const leftStrs = this.leftChild.renderStrings({h:childHeight, w: leftWidth});
		const rightStrs = this.rightChild.renderStrings({h:childHeight, w: rightWidth});
		
		let finalStrs = [];
		for(let i = 0; i < childHeight; i++){
			finalStrs.push(leftStrs[i] + this.splitChar + rightStrs[i]);
		}

		let lastStr;
		if(this.focusedLeft){
			lastStr = this.getSelectedChildSubSTr(this.leftChild, leftWidth) + this.splitChar + this.getUnselectedChildSubSTr(this.rightChild, rightWidth);
		}else{
			lastStr = this.getUnselectedChildSubSTr(this.leftChild, leftWidth) + this.splitChar + this.getSelectedChildSubSTr(this.rightChild, rightWidth);
		}
		finalStrs.push(lastStr);

		return finalStrs;
	}

	getSelectedChildSubSTr(child: Node, width: number){
		let args = child.getArgumentHints();
		let pot = (args.join(this.selectedStr) + ''.padEnd(3, this.selectedStr)).padStart(width, this.selectedStr);
		return pot.length > width ? ''.padEnd(width, this.selectedStr) : pot;
	}
	getUnselectedChildSubSTr(child: Node, width: number){
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


