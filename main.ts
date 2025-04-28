import { InputManagaer } from './TuiSrc/InputManger.ts';
import { BorderNode } from './TuiSrc/Nodes/BorderNode.ts';
import { CenteredTextNode } from './TuiSrc/Nodes/CenteredTextNode.ts';
import { HorizontalSplitNode, HorizontalSplitNodeBottomInput } from './TuiSrc/Nodes/HorizontalSplitNodes.ts';
import { PaddingNode } from './TuiSrc/Nodes/PaddingNode.ts';
import { TextInput } from './TuiSrc/Nodes/TextInput.ts';
import { TuiManager } from './TuiSrc/TuiManager.ts';

const tuiManger = new TuiManager();

const centerTextingNode = new CenteredTextNode(['Welcom', 'Node based rendering']);
const textEntering = new TextInput(tuiManger.rerender, {});
const paddedTextEntering = new PaddingNode(textEntering, 2, 1);
const splitterNode = new HorizontalSplitNodeBottomInput(centerTextingNode, paddedTextEntering, 0.8, '-');
const borderNode = new BorderNode(splitterNode, '#');

tuiManger.setMainNode(borderNode);
tuiManger.start();
