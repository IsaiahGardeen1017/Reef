import { TerminalSize } from '../Reef.ts';
import { Node } from './Node.ts';

export class HomeNode extends Node {
	child: Node;

	constructor(child: Node, exitApplication: () => any) {
		super();
		this.child = child;
	}

	get minHeight(): number {
		return this.child.minHeight;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return this.child.handleInput(input);
	}

	renderStrings(size: TerminalSize): string[] {
		return this.child.renderStrings(size);
	}
}
