import { CenteredTextNode, HorizontalSplitNode, HorizontalSplitNodeBottomInput, Node } from '../../../mod.ts';
import { PadBorderMarginSmart } from '../../../src/Nodes/LayoutNodes/PadBorderMarginSmart.ts';
import { SideBySideSelectable } from '../../../src/Nodes/NavigationNodes/SideBySideNode.ts';

export function getCannonBallCalculatorNode(): Node {
	const ctn = new CenteredTextNode(['Gunpowdering']);

	const botTxt = new CenteredTextNode(['Entering Stuff Here']);

	const sideBySideInputs = new SideBySideSelectable(botTxt, botTxt);

	const horxSplit = new HorizontalSplitNodeBottomInput(ctn, sideBySideInputs, {
		splitStr: '-',
		percentTop: 0.8,
	});

	const exteriorSmartNode = new PadBorderMarginSmart(horxSplit, {
		boxHeight: 30,
		boxWidth: 75,
	});

	return exteriorSmartNode;
}
