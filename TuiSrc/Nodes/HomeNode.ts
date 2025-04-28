import { TerminalSize } from '../TuiManager.ts';
import { Node } from './Node.ts';

export class HomeNode extends Node {
	child: Node;

	constructor(child: Node, exitApplication: () => any) {
		super();
		this.child = child;
	}

	get minHeight() {
		return this.child.minHeight;
	}

	handleInput(input: Uint8Array<ArrayBuffer>) {
		this.child.handleInput(input);
	}

	renderStrings(size: TerminalSize): string[] {
		return this.child.renderStrings(size);
	}
}
