import { CenteredTextNode, MainMenuNode, MenuEntry, ReefInstance } from '../mod.ts';
import { PadBorderMarginBasic, pbmBasicDetail } from '../src/Nodes/LayoutNodes/PadBorderMarginBasic.ts';
import { PadBorderMarginSmart, pbmSmartDetails } from '../src/Nodes/LayoutNodes/PadBorderMarginSmart.ts';
import { defaultBordering } from '../src/Themeing/Theme.ts';
import { getCannonBallCalculatorNode } from './src/UI/CannonballCalculator.ts';

const Reef = new ReefInstance();

const yoodLayerOuter = getCannonBallCalculatorNode();

const nodeEntries: MenuEntry[] = [{
	node: yoodLayerOuter,
	label: 'Gun Powder Calculator',
	letter: 'G',
}];

const titleMenu = new MainMenuNode('Welcome', nodeEntries);

Reef.setMainNode(titleMenu);
Reef.start();
