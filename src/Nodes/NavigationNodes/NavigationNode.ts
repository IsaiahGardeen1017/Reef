import { Node, NodeOptions } from '../Node.ts';

export type MenuEntry = {
	node: Node;
	label: string;
	letter: string;
};

export abstract class NavigationNode extends Node {
	entries: MenuEntry[];
	selected: undefined | Node;

	constructor(entries: MenuEntry[], options?: NodeOptions) {
		super(options);
		this.entries = entries ? entries : [];
	}

	addEntry(entry: MenuEntry) {
		this.entries.push(entry);
	}

	removeEntry(labelOrLetter: string): MenuEntry | undefined {
		let entry = this.entries.find((entry) => {
			return entry.label === labelOrLetter;
		});
		if (!entry) {
			entry = this.entries.find((entry) => {
				return entry.letter === labelOrLetter;
			});
		}
		return entry;
	}
}
