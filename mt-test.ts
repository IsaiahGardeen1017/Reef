import { ProcessRunner } from './mtFuncsDEL/ProcessRunner.ts';
import { InputInterupterNode, InterceptDetail } from './src/Nodes/ioNodes/InputIntercepterNode.ts';
import { ScrollableFeedNode } from './src/Nodes/ioNodes/ScrollableFeedNode.ts';
import { SideBySideSelectable } from './src/Nodes/NavigationNodes/SideBySideNode.ts';
import { ReefInstance } from './src/Reef.ts';
const reefer = new ReefInstance();

// SETUP LEFT NODE
const wpScrollingNode = new ScrollableFeedNode();
const processWpOutputFunc = (str: string) => {
	wpScrollingNode.sendLine(str);
	reefer.redraw = true;
};
const wpDir = 'C:\\Rest2.4.4\\iops-rest-packages';
const wpCmd = ['C:\\Program Files\\Git\\bin\\bash.exe', './scripts/watch-pkg.sh','fhir','-b'];
const wpRunner = new ProcessRunner(wpCmd, wpDir, processWpOutputFunc);
const wpInterceptDetails: InterceptDetail[] = [{
	label: '[Q]uit',
	key: 'q',
	func: async () => {
		await wpRunner.stop();
		reefer.reraw();
	},
}, {
	label: '[S]tart',
	key: 's',
	func: () => {
		wpRunner.start();
	},
}];
const leftNode = new InputInterupterNode(wpScrollingNode, wpInterceptDetails);
//wpRunner.start();

// SETUP RIGHT NODE
const restdScrollingNode = new ScrollableFeedNode();
const processRestOutputFunc = (str: string) => {
	restdScrollingNode.sendLine(str);
	reefer.redraw = true;
};
const restDir = 'C:\\Rest2.4.4\\webapi-server\\packages\\server\\build';
const restdCmd = ['C:\\Program Files\\Git\\bin\\bash.exe', 'node', '--inspect=3100', 'index'];
const restdRunner = new ProcessRunner(restdCmd, restDir, processRestOutputFunc);
const restdInterceptDetails: InterceptDetail[] = [{
	label: '[Q]uit',
	key: 'q',
	func: async () => {
		await restdRunner.stop();
		reefer.reraw();
	},
}, {
	label: '[S]tart',
	key: 's',
	func: () => {
		restdRunner.start();
	},
}];
const rightNode = new InputInterupterNode(restdScrollingNode, restdInterceptDetails);
//restdRunner.start();

//SETUP OTHER NODES
const sideBySide = new SideBySideSelectable(leftNode, rightNode);
reefer.setMainNode(sideBySide);
reefer.setDebugFunc((str) => {
	wpScrollingNode.sendLine(str);
	restdScrollingNode.sendLine(str);
});
reefer.start();
