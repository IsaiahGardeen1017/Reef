import { assert } from '@std/assert/assert';
import { centerTexting } from '../Layers/CenterText.ts';
import { exteriorEdging } from '../Layers/ExteriorEdging.ts';
import { layerGridsToStringList } from '../Layers/Layer.ts';

Deno.test("loggin", () => {
    const size = {
        h: 100,
        w: 100,
    }


    const texts  = ['OK', 'Welcome'];
	const layers = [
		centerTexting(size, texts),
		exteriorEdging(size),
	];
    console.log('LAYERS');
    console.log(layers);
    console.log('\nGRID');
	console.log(layerGridsToStringList(layers));
    assert(true);
});