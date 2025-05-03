export type Input =
	// Letters (I hate auto-linting)
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z'
	| 'A'
	| 'B'
	| 'C'
	| 'D'
	| 'E'
	| 'F'
	| 'G'
	| 'H'
	| 'I'
	| 'J'
	| 'K'
	| 'L'
	| 'M'
	| 'N'
	| 'O'
	| 'P'
	| 'Q'
	| 'R'
	| 'S'
	| 'T'
	| 'U'
	| 'V'
	| 'W'
	| 'X'
	| 'Y'
	| 'Z'
	// Numbers
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	// Symbols (Common) - Adding more symbols that are generally reliable
	| '`'
	| '~'
	| '!'
	| '@'
	| '#'
	| '$'
	| '%'
	| '^'
	| '&'
	| '*'
	| '('
	| ')'
	| '-'
	| '_'
	| '='
	| '+'
	| '['
	| '{'
	| ']'
	| '}'
	| '\\'
	| '|'
	| ';'
	| ':'
	| "'"
	| '"'
	| ','
	| '<'
	| '.'
	| '>'
	| '/'
	| '?'
	| ' ' // Explicitly adding space
	// Whitespace and Navigation
	| 'TAB'
	| 'ENTER'
	// Function Keys (F1-F12 are generally well-supported)
	| 'F1'
	| 'F2'
	| 'F3'
	| 'F4'
	| 'F5'
	| 'F6'
	| 'F7'
	| 'F8'
	| 'F9'
	| 'F10'
	| 'F11'
	| 'F12'
	// Modifier Keys (While their individual press might not be sent, combinations are)
	// We keep these to indicate the *potential* for a modified keypress, though
	// handling combinations requires more sophisticated parsing.
	| 'CONTROL'
	| 'ALT'
	| 'SHIFT'
	| 'META' // META is often the Windows or Command key
	// Arrow Keys
	| 'ARROWLEFT'
	| 'ARROWUP'
	| 'ARROWRIGHT'
	| 'ARROWDOWN'
	// Other Special Keys
	| 'ESCAPE'
	| 'BACKSPACE'
	| 'DELETE'
	| 'HOME'
	| 'END'
	| 'PAGEDOWN'
	| 'PAGEUP'
	| 'INSERT'
	// Unknown
	| 'UNKNOWN';

// This function attempts to map a raw terminal input byte array to a standardized Input type.
// It prioritizes common escape sequences for control keys and decodes
// regular characters as UTF-8.
export function mapEventToInput(event: Uint8Array<ArrayBuffer>): Input {
	if (event.length === 0) {
		return 'UNKNOWN'; // Handle empty events
	}

	// Attempt to decode the entire event as a string first. This handles
	// regular characters and basic escape sequences that result in a known string.
	const decodedString = new TextDecoder().decode(event);

	switch (decodedString) {
		// Common control characters and their string representations
		case '\x7f': // ASCII DEL (Backspace)
			return 'BACKSPACE';
		case '\r': // ASCII CR (Enter)
			return 'ENTER';
		case '\n': // ASCII LF (Enter - common on Unix-like systems)
			return 'ENTER';
		case '\t': // ASCII HT (Tab)
			return 'TAB';
		case '\x1b': // ASCII ESC (Escape)
			// If the decoded string is just ESC, it's the escape key itself.
			// More complex escape sequences are handled below.
			return 'ESCAPE';
		case ' ': // Space
			return ' ';
		case '\x1b[A': // CSI Up Arrow
			return 'ARROWUP';
		case '\x1b[B': // CSI Down Arrow
			return 'ARROWDOWN';
		case '\x1b[C': // CSI Right Arrow
			return 'ARROWRIGHT';
		case '\x1b[D': // CSI Left Arrow
			return 'ARROWLEFT';
		case '\x1b[3~': // CSI Delete
			return 'DELETE';
		case '\x1b[2~': // CSI Insert
			return 'INSERT';
		case '\x1b[5~': // CSI Page Up
			return 'PAGEUP';
		case '\x1b[6~': // CSI Page Down
			return 'PAGEDOWN';
		case '\x1b[H': // CSI Home (some terminals)
		case '\x1b[1~': // CSI Home (some terminals)
			return 'HOME';
		case '\x1b[F': // CSI End (some terminals)
		case '\x1b[4~': // CSI End (some terminals)
			return 'END';

		// Function Keys (Common CSI and SS3 sequences)
		case '\x1bOP': // SS3 F1
		case '\x1b[P': // CSI F1 (less common)
		case '\x1b[[A': // Older VT52 F1 sequence
			return 'F1';
		case '\x1bOQ': // SS3 F2
		case '\x1b[Q': // CSI F2 (less common)
		case '\x1b[[B': // Older VT52 F2 sequence
			return 'F2';
		case '\x1bOR': // SS3 F3
		case '\x1b[R': // CSI F3 (less common)
		case '\x1b[[C': // Older VT52 F3 sequence
			return 'F3';
		case '\x1bOS': // SS3 F4
		case '\x1b[S': // CSI F4 (less common)
		case '\x1b[[D': // Older VT52 F4 sequence
			return 'F4';
		case '\x1b[15~': // CSI F5
			return 'F5';
		case '\x1b[17~': // CSI F6
			return 'F6';
		case '\x1b[18~': // CSI F7
			return 'F7';
		case '\x1b[19~': // CSI F8
			return 'F8';
		case '\x1b[20~': // CSI F9
			return 'F9';
		case '\x1b[21~': // CSI F10
			return 'F10';
		case '\x1b[23~': // CSI F11
			return 'F11';
		case '\x1b[24~': // CSI F12
			return 'F12';

		default:
			// If it's not a known escape sequence, check if it's a single character
			if (decodedString.length === 1) {
				const potentialInput = decodedString as Input;
				// A more comprehensive check against the defined single characters
				if (
					(potentialInput >= 'a' && potentialInput <= 'z') ||
					(potentialInput >= 'A' && potentialInput <= 'Z') ||
					(potentialInput >= '0' && potentialInput <= '9') ||
					'`~!@#$%^&*()-_=+[{]}\\|;:\'"<,>.?/ '.includes(potentialInput) // Added space
				) {
					return potentialInput;
				}
			}

			// If it's an unknown escape sequence or multi-character input that
			// isn't a single character, return UNKNOWN.
			return 'UNKNOWN';
	}
}
