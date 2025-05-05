import { assert } from '@std/assert/assert';
import { intStringFixed, maybeTruncate, padEqual } from './strUtils.ts';
import { assertEquals } from '@std/assert';

Deno.test('padEqual Less than', () => {
	const str = 'abcde';
	const pe = padEqual(str, 4);
	assertEquals(pe, 'abcd', `returned ${pe} not abcd`);
});

Deno.test('padEqual', () => {
	const strs = [
		'yo gotti',
		'',
		'Greegor',
		'yackaloo',
		'yackaloog',
	];

	const lengths = [
		5,
		10,
		21,
	];

	for (const str of strs) {
		for (const l of lengths) {
			const padded = padEqual(str, l);
			assertEquals(padded.length, l, `Test failed: ${str} l:${l} returned ${padded} with length ${padded.length}`);
		}
	}
});

Deno.test('simple test', () => {
	let s;
	s = intStringFixed(2, 2);
	assertEquals(s, '2 ');
	s = intStringFixed(52, 2);
	assertEquals(s, '52');
	s = intStringFixed(111222333, 3);
	assertEquals(s, '_33');
	s = intStringFixed(786, 2);
	assertEquals(s, '_6');
});


Deno.test('maybeTruncate', () => {
	const strs = [
		'gfsagfdagfgdagsgafdgfdgfdafgaagfgf',
		'',
		'fdsaf',
		'aaaaasssssddddd',
		'aaaaasssssdddd',
		'aaaaasssssddddd1'
	]

	for(const str of strs){
		const s = maybeTruncate(str, 15, '...');
		assert(s.length <= 15, 'Too long: ' + s);
		assert(maybeTruncate(str, 15, '...', ' ').length === 15, 'Wrong length: ' + s);

	}
})