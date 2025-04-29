import type { InputManagaer } from './src/InputManger.ts';
import type { BorderNode } from './src/Nodes/LayoutNodes/BorderNode.ts';
import { CenteredTextNode } from './src/Nodes/LayoutNodes/CenteredTextNode.ts';
import { HorizontalSplitNodeBottomInput } from './src/Nodes/LayoutNodes/HorizontalSplitNodes.ts';
import { MainMenuNode } from './src/Nodes/NavigationNodes/MainMenuNode.ts';
import { MenuEntry } from './src/Nodes/NavigationNodes/NavigationNode.ts';
import { PaddingNode } from './src/Nodes/LayoutNodes/PaddingNode.ts';
import { TextFeedNode } from './src/Nodes/ioNodes/TextFeedNode.ts';
import { TextInputNode } from './src/Nodes/ioNodes/TextInputNode.ts';
import { ReefInstance } from './src/Reef.ts';

const tuiManger = new ReefInstance();

const textFeed = new TextFeedNode(5);
const textEntering = new TextInputNode({});
textEntering.addListeningFunc((line) => {
	textFeed.sendLine(line);
});
const paddedTextEntering = new PaddingNode(textEntering, 2, 1);
const paddedTextFeed = new PaddingNode(textFeed, 1, 0);
const splitterNode = new HorizontalSplitNodeBottomInput(paddedTextFeed, paddedTextEntering, 0.8, '-');

const nodeEntries: MenuEntry[] = [{
	node: splitterNode,
	label: 'Texting',
	letter: 't',
}, {
	node: new CenteredTextNode(['Credits', '', 'Created by Isaiah Gardeen']),
	label: 'Credits',
	letter: 'c',
}];

const titleMenu = new MainMenuNode('Welcome', nodeEntries);

tuiManger.setMainNode(titleMenu);
tuiManger.start();
