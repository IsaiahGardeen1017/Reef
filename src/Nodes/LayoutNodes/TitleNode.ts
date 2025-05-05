import { padEqual } from '../../../utils/strUtils.ts';
import { TerminalSize } from '../../Reef.ts';
import { Node, NodeOptions } from '../Node.ts';

export class TitleNode extends Node {
	child: Node;
	title: string;

	constructor(child: Node, title: string, opts?: NodeOptions) {
		super(opts);
		this.title = title;
		this.child = child;
	}

	setTitle(title: string) {
		this.title = title;
	}

	override renderStrings(size: TerminalSize): string[] {
		const titleString = padEqual(this.title, size.w, ' ');
		const childStrings = this.child.renderStrings({
			h: size.h - 1,
			w: size.w,
		});
		childStrings.unshift(titleString);
		return childStrings;
	}
	override get minHeight(): number {
		return this.child.minHeight + 1;
	}
	override handleInput(input: Uint8Array<ArrayBuffer>): boolean {
		return this.child.handleInput(input);
	}
	override notifySelectedStatus(isSelected: boolean): boolean {
		return this.child.notifySelectedStatus(isSelected);
	}
}
