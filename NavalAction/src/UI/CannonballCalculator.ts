import { CenteredTextNode, HorizontalSplitNodeBottomInput, Node } from '../../../mod.ts';
import { TextInputNode } from '../../../src/Nodes/ioNodes/TextInputNode.ts';
import { PadBorderMarginSmart } from '../../../src/Nodes/LayoutNodes/PadBorderMarginSmart.ts';
import { TitleNode } from '../../../src/Nodes/LayoutNodes/TitleNode.ts';
import { SideBySideSelectable } from '../../../src/Nodes/NavigationNodes/SideBySideNode.ts';

class CannonInfo {
	numCannons?: number;
	numPowder?: number;

	get outStrings(): string[] {
		const retStrs = ['Gunpowdering'];
		if (!this.numCannons) {
			retStrs.push('Need number of cannons');
		}
		if (!this.numPowder) {
			retStrs.push('Need number of powder');
		}
		if (this.numCannons && this.numPowder) {
			retStrs.push(`Gun: ${this.numCannons} Powder: ${this.numPowder}`);
			const broadsideAmounts = [15, 20, 25, 30, 40, 50, 75, 100, 200];
			for (const b of broadsideAmounts) {
				const strrrr = `${(b + '').padStart(3, ' ')}: ${(Math.ceil((this.numCannons * b) / 2) + ' balls').padStart(14, ' ')} | ${
					(Math.ceil((this.numPowder * b) / 2) + ' powder').padStart(15, ' ')
				}`;
				retStrs.push(strrrr);
			}
		}

		return retStrs;
	}
}
export function getCannonBallCalculatorNode(): Node {
	const infoHolder = new CannonInfo();

	const ctn = new CenteredTextNode(infoHolder.outStrings);

	const cannonAmountInput = new TextInputNode();
	cannonAmountInput.addListener((line) => {
		const parsedInt = parseInt(line);
		if (parsedInt) {
			infoHolder.numCannons = parsedInt;
		}
		ctn.setLines(infoHolder.outStrings);
	});
	const cannonAmountInputWrapper = new TitleNode(cannonAmountInput, 'Cannons');

	const powderAmountInput = new TextInputNode();
	powderAmountInput.addListener((line) => {
		const parsedInt = parseInt(line);
		if (parsedInt) {
			infoHolder.numPowder = parsedInt;
		}
		ctn.setLines(infoHolder.outStrings);
	});
	const powderAmountInputWrapper = new TitleNode(powderAmountInput, 'Powder');

	const sideBySideInputs = new SideBySideSelectable(cannonAmountInputWrapper, powderAmountInputWrapper, {
		selectedStr: '*',
	});

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
