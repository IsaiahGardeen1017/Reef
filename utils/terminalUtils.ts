export type TerminalSize = {
	h: number;
	w: number;
};

export function getTerminalSize(): TerminalSize {
	const { columns, rows } = Deno.consoleSize();
	return { w: columns, h: rows };
}
