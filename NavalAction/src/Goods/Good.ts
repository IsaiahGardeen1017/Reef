export type GoodType = 'Resource' | 'Cannon' | 'Consumable';

export type GoodName = RawGoods | CraftedGoods;
export type RawGoods =
	| 'Iron Ore'
	| 'Oak Log'
	| 'Medicinal Bark'
	| 'Fish Meat'
	| 'Tobacco'
	| 'Molasses'
	| 'Hemp';

export type CraftedGoods =
	| 'Charcoal'
	| 'Iron Fittings'
	| 'Oak Planks'
	| 'Provisions'
	| 'Hull Repairs'
	| 'Medicine'
	| 'Barrels'
	| 'Rum'
	| 'Sail Canvas';

export type Good = {
	cost: number;
	name: GoodName;
	recipe: {
		good: GoodName;
		num: number;
	}[] | undefined;
	craftQuantity: number;
};

const rawPrices: Record<RawGoods, number> = {
	'Oak Log': 3,
	'Iron Ore': 4,
	'Medicinal Bark': 5,
	'Hemp': 3,
	'Fish Meat': 2,
	'Tobacco': 2,
	'Molasses': 2,
};

export const Goods: Record<GoodName, Good> = {
	'Hemp': {
		name: 'Hemp',
		cost: rawPrices['Hemp'],
		recipe: undefined,
		craftQuantity: 1,
	},
	'Iron Ore': {
		name: 'Iron Ore',
		cost: rawPrices['Oak Log'],
		recipe: undefined,
		craftQuantity: 1,
	},
	'Oak Log': {
		name: 'Oak Log',
		cost: rawPrices['Oak Log'],
		recipe: undefined,
		craftQuantity: 1,
	},
	'Charcoal': {
		cost: 1,
		name: 'Charcoal',
		recipe: [{ num: 40, good: 'Oak Log' }],
		craftQuantity: 100,
	},
	'Iron Fittings': {
		cost: 1,
		name: 'Iron Fittings',
		recipe: [{ num: 20, good: 'Charcoal' }, { num: 20, good: 'Iron Ore' }],
		craftQuantity: 100,
	},
	'Oak Planks': {
		cost: 1,
		name: 'Oak Planks',
		recipe: [{ num: 40, good: 'Oak Log' }],
		craftQuantity: 100,
	},
	'Hull Repairs': {
		cost: 276,
		name: 'Hull Repairs',
		recipe: [{ good: 'Oak Planks', num: 100 }, { good: 'Iron Fittings', num: 62 }],
		craftQuantity: 10,
	},
	'Sail Canvas': {
		name: 'Sail Canvas',
		recipe: [{ good: 'Hemp', num: 40 }],
		craftQuantity: 100,
		cost: 1,
	},
	'Medicinal Bark': {
		cost: rawPrices['Medicinal Bark'],
		name: 'Medicinal Bark',
		recipe: undefined,
		craftQuantity: 100,
	},
	'Provisions': {
		cost: 25,
		name: 'Provisions',
		recipe: [{ good: 'Fish Meat', num: 100 }, { good: 'Barrels', num: 100 }, { good: 'Rum', num: 100 }, { good: 'Tobacco', num: 100 }],
		craftQuantity: 50,
	},
	'Medicine': {
		cost: 448,
		name: 'Medicine',
		recipe: [{ good: 'Sail Canvas', num: 25 }, { good: 'Medicinal Bark', num: 25 }, { good: 'Provisions', num: 5 }],
		craftQuantity: 100,
	},
	'Fish Meat': {
		cost: 0,
		name: 'Iron Ore',
		recipe: undefined,
		craftQuantity: 0,
	},
	Tobacco: {
		cost: rawPrices['Tobacco'],
		name: 'Tobacco',
		recipe: undefined,
		craftQuantity: 1,
	},
	Barrels: {
		cost: 1,
		name: 'Barrels',
		recipe: [{ good: 'Iron Fittings', num: 20 }, { good: 'Oak Planks', num: 30 }],
		craftQuantity: 50,
	},
	Rum: {
		cost: 1,
		name: 'Rum',
		recipe: [{ good: 'Molasses', num: 50 }, { good: 'Barrels', num: 50 }],
		craftQuantity: 50,
	},
	Molasses: {
		cost: rawPrices['Molasses'],
		name: 'Molasses',
		recipe: undefined,
		craftQuantity: 1,
	},
};
