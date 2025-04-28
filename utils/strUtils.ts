export function padEqual(str: string, len: number, padStr = ' ') {
	if (len <= str.length) {
		return str.substring(0, len - 1);
	}

	const padLen = Math.floor((len - str.length) / 2);
	const padStart = padStr.repeat(padLen / padStr.length) + padStr.slice(0, padLen % padStr.length);
	const padEndLen = len - str.length - padLen;
	const padEnd = padStr.repeat(padEndLen / padStr.length) + padStr.slice(0, padEndLen % padStr.length);

	return padStart + str + padEnd;
}

/**
 * 
 * @param lines Input Lines
 * @param height Height of output
 * @returns A string array of length 'height', WARNING - strings are not of any set length
 */
export function centerHorizontal(lines: string[], height: number): string[]{
	
	const ll = lines.length;
	if(ll > height){
		return lines.slice(0, height - 1);
	}else if (ll === height){
		return lines;
	}else{
		let strs: string[] = [];
		const numEmptyLinesToAdd = height - ll;
		const numEmptyAfter = Math.ceil(numEmptyLinesToAdd / 2);
		const numEmptyBefore = numEmptyLinesToAdd - numEmptyAfter;
		addArrayEntries(strs, numEmptyBefore);
		for(const l of lines){
			strs.push(l);
		}
		addArrayEntries(strs, numEmptyAfter);
		return strs;
	}
}

function addArrayEntries(arr: string[], num: number){
	for(let i = 0; i < num; i++){
		arr.push('');
	}
}

/**
 * @param str String to repeat
 * @param len Lenght of ouput
 * @returns str repeated to len length
 */
export function padRepeat(str: string, len: number) {
	if (len <= 0) {
		return '';
	}

	const repeatCount = Math.ceil(len / str.length);
	const repeatedString = str.repeat(repeatCount);

	return repeatedString.slice(0, len);
}

export function intStringFixed(int: number, len: number, pad = ' ') {
	const intStr = int.toString();
	const isl = intStr.length;
	if (isl === len) {
		return intStr;
	}

	if (isl > len) {
		// TODO IDK BOUT THIS ONE
		return '_' + intStr.substring((isl - len) + 1, isl);
	}

	if (isl < len) {
		return intStr + padRepeat(pad, len - isl);
	}
}


/**
 * 
 * @param str String to truncate
 * @param len Desired Length
 * @param truncator What truncation is marked with, '...' by default
 * @param lengthener What the extra space is filled with
 */
export function maybeTruncate(str: string, len: number, truncator = '...', lengthener = ' '): string {
	if(str.length === len){
		return str;
	}else if(str.length < len){
		return str.padEnd(len, lengthener);
	}else{
		return str.substring(0, str.length - (1 + truncator.length)) + truncator;
	}
}