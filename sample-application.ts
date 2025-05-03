import {
	CenteredTextNode,
	HorizontalSplitNodeBottomInput,
	MainMenuNode,
	MenuEntry,
	PaddingNode,
	ReefInstance,
	TextFeedNode,
	TextInputNode,
} from './mod.ts';

const tuiManger = new ReefInstance();

const textFeed = new TextFeedNode(5);
const textEntering = new TextInputNode();
textEntering.addListener((line) => {
	textFeed.sendLine(line);
});

const paddedTextEntering = new PaddingNode(textEntering, 2, 1);
const paddedTextFeed = new PaddingNode(textFeed, 1, 0);
const splitterNode = new HorizontalSplitNodeBottomInput(paddedTextFeed, paddedTextEntering, { splitStr: '-', percentTop: 0.8 });

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
