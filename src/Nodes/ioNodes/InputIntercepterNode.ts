import { Input, mapEventToInput } from '../../EventToInput.ts';
import { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';

export type InterceptDetail = {
	key: Input;
	label: string;
	func: () => any;
};

export class InputInterupterNode extends Node {
	child: Node;
	actions: InterceptDetail[];

	constructor(child: Node, actions: InterceptDetail[], opts?: NodeOptions) {
		super(opts);
		this.child = child;
		this.actions = actions;
	}

	override getArgumentHints(): string[] {
		return this.actions.map((act) => {
			return act.label;
		});
	}

	renderStrings(size: TerminalSize): string[] {
		return this.child.renderStrings(size);
	}

	get minHeight(): number {
		return this.child.minHeight;
	}

	handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		for (const action of this.actions) {
			if (action.key === mapEventToInput(input)) {
				action.func();
				return true;
			}
		}
		return this.child.handleInput(input);
	}
}
