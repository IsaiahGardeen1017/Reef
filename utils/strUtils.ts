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

export function padRepeat(str: string, len: number) {
    if (len <= 0) {
        return "";
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
