import { assert } from '@std/assert';
import { CraftedGoods, Good, GoodName, Goods } from './src/Goods/Good.ts';

assert(Deno.args.length >= 2, 'Need 2 args');

const numWanted = Deno.args.shift();
const goodName = Deno.args.join(' ');

type CraftDetails = {
	rawQuantities: Partial<Record<GoodName, number>>;
	craftQuantities: Partial<Record<GoodName, number>>;
	craftOrder: GoodName[];
};

const obj: CraftDetails = { rawQuantities: {}, craftQuantities: {}, craftOrder: [] };
getReqsRec(goodName as GoodName, parseInt('' + numWanted), obj);
const outStrs = craftDetailStrings(obj);
console.log(outStrs.join('\n'));

function getReqsRec(goodName: GoodName, amount: number, bom: CraftDetails) {
	const good = Goods[goodName];
	assert(good, 'Couldnt find good ' + goodName);
	if (!good.recipe) {
		bom.rawQuantities[goodName] = (bom.rawQuantities[goodName] ? bom.rawQuantities[goodName] : 0) + amount;
	} else {
		const numCraftsNeeded = Math.ceil(amount / good.craftQuantity);
		if (!bom.craftOrder.includes(goodName)) {
			bom.craftOrder.push(goodName);
		}
		const prev = bom.craftQuantities[goodName] ? bom.craftQuantities[goodName] : 0;
		bom.craftQuantities[goodName] = prev + numCraftsNeeded;
		for (const r of good.recipe) {
			getReqsRec(r.good, r.num * numCraftsNeeded, bom);
		}
	}
}

function craftDetailStrings(bom: CraftDetails): string[] {
	const strs: string[] = [];
	let rawGoodCost = 0;
	for (const good in bom.rawQuantities) {
		const numToGet = bom.rawQuantities[good as GoodName] || 0;
		const costPer = Goods[good as GoodName].cost + 1;
		rawGoodCost += numToGet * costPer;
		strs.push(`${good}: ${numToGet} `.padEnd(28, '-') + ` ${costPer} per for ${numToGet * costPer}`);
	}
	strs.push(`RawGood Total Cost: ${rawGoodCost}`);

	strs.push('');

	let totalCraftCost = 0;
	bom.craftOrder.forEach((good) => {
		const num = bom.craftQuantities[good] as number;
		const costToCraft = num * Goods[good].cost;
		totalCraftCost += costToCraft;
		strs.push(`Craft ${num} ${good} `.padEnd(28, '-') + ` makes ${num * Goods[good].craftQuantity} costs ${costToCraft}`);
	});
	strs.push(`Crafting Total Cost: ${totalCraftCost}`);

	strs.push('');
	strs.push(`Total Cost: ${totalCraftCost + rawGoodCost}`);

	return strs;
}
