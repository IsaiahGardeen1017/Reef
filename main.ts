import { InputManagaer } from './TuiSrc/InputManger.ts';
import { BorderNode } from './TuiSrc/Nodes/BorderNode.ts';
import { CenteredTextNode } from './TuiSrc/Nodes/CenteredTextNode.ts';
import { HorizontalSplitNode, HorizontalSplitNodeBottomInput } from './TuiSrc/Nodes/HorizontalSplitNodes.ts';
import { PaddingNode } from './TuiSrc/Nodes/PaddingNode.ts';
import { TextFeedNode } from './TuiSrc/Nodes/TextFeed.ts';
import { TextInput } from './TuiSrc/Nodes/TextInput.ts';
import { TuiManager } from './TuiSrc/TuiManager.ts';

const tuiManger = new TuiManager();

const textFeed = new TextFeedNode(5);
const textEntering = new TextInput(tuiManger.rerender, {});
textEntering.addListeningFunc((line) => {
    textFeed.sendLine(line);
});


const paddedTextEntering = new PaddingNode(textEntering, 2, 1);
const splitterNode = new HorizontalSplitNodeBottomInput(textFeed, paddedTextEntering, 0.8, '-');
const borderNode = new BorderNode(splitterNode, '#');

tuiManger.setMainNode(borderNode);
tuiManger.start();
