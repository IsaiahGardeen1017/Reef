import { intStringFixed } from '../utils/strUtils.ts';
import { assertEquals } from "jsr:@std/assert";

Deno.test("simple test", () => {
    let s;
    s = intStringFixed(2, 2);
    assertEquals(s, "2 ");
    s = intStringFixed(52, 2);
    assertEquals(s, "52");
    s = intStringFixed(111222333, 3);
    assertEquals(s, "_33");
    s = intStringFixed(786, 2);
    assertEquals(s, "_6");
});
