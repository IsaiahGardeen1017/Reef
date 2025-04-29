import type { TerminalSize } from '../Reef.ts';

export type NodeOptions = {
	forcedMinHeight?: number;
};

export abstract class Node<O extends NodeOptions = NodeOptions> {
	opts: Partial<O>;

	constructor(options?: O) {
		this.opts = options || {};
	}

	abstract renderStrings(size: TerminalSize): string[];

	abstract get minHeight(): number;

	protected calcMinHeight(min: number): number {
		if (this.opts?.forcedMinHeight) {
			return Math.max(min, this.opts.forcedMinHeight);
		}
		return min;
	}

	/**
	 * When input arrives at node (Typically just one key at a time) the node can either do something with the input or send it to a child
	 * @param input
	 * @returns true if input was used, false if not
	 */
	abstract handleInput(input: Uint8Array<ArrayBuffer>): boolean;
}
