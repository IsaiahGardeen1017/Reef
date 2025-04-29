import { Node, NodeOptions } from '../Node.ts';

export type AutoCompleter = (text: string) => string[];
export type ListenerFunction<T> = (input: T) => any;

export abstract class InputNode<T, O extends NodeOptions = NodeOptions> extends Node<O> {
	listeners: ListenerFunction<T>[];

	constructor(listeners?: ListenerFunction<T>[], options?: O) {
		super(options);
		if (listeners) {
			this.listeners = listeners;
		} else {
			this.listeners = [];
		}
	}

	addListener(func: ListenerFunction<T>) {
		this.listeners.push(func);
	}

	protected notifyListeneres(arg: T) {
		for (let i = 0; i < this.listeners.length; i++) {
			this.listeners[i](arg);
		}
	}
}
