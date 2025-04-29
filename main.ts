import type { InputManagaer } from './src/InputManger.ts';
import type { BorderNode } from './src/Nodes/BorderNode.ts';
import { CenteredTextNode } from './src/Nodes/CenteredTextNode.ts';
import { type HorizontalSplitNode, HorizontalSplitNodeBottomInput } from './src/Nodes/HorizontalSplitNodes.ts';
import { type MainMenuEntry, MainMenuNode } from './src/Nodes/MainMenuNode.ts';
import { PaddingNode } from './src/Nodes/PaddingNode.ts';
import { TextFeedNode } from './src/Nodes/TextFeedNode.ts';
import { TextInputNode } from './src/Nodes/TextInputNode.ts';
import { ReefInstance } from './src/Reef.ts';

const tuiManger = new ReefInstance();

const textFeed = new TextFeedNode(5);
const textEntering = new TextInputNode(tuiManger.rerender, {});
textEntering.addListeningFunc((line) => {
	textFeed.sendLine(line);
});
const paddedTextEntering = new PaddingNode(textEntering, 2, 1);
const paddedTextFeed = new PaddingNode(textFeed, 1, 0);
const splitterNode = new HorizontalSplitNodeBottomInput(paddedTextFeed, paddedTextEntering, 0.8, '-');

const nodeEntries: MainMenuEntry[] = [{
	node: splitterNode,
	title: 'Texting',
	letter: 't',
}, {
	node: new CenteredTextNode(['Credits', '', 'Created by Isaiah Gardeen']),
	title: 'Credits',
	letter: 'c',
}];

const titleMenu = new MainMenuNode(tuiManger.rerender, 'Welcome', nodeEntries);

tuiManger.setMainNode(titleMenu);
tuiManger.start();
