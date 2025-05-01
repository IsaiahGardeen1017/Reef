import { ProcessRunner } from './mtFuncsDEL/ProcessRunner.ts';
import { InterceptDetail, InputInterupterNode } from './src/Nodes/ioNodes/InputIntercepterNode.ts';
import { ScrollableFeedNode } from './src/Nodes/ioNodes/ScrollableFeedNode.ts';
import { SideBySideSelectable } from './src/Nodes/NavigationNodes/SideBySideNode.ts';
import { ReefInstance } from './src/Reef.ts';

const reefer = new ReefInstance();


const script1FeedNode = new ScrollableFeedNode();
const script1ProcessRunnerOutputFunc = (str: string) => {
  script1FeedNode.sendLine(str);
  reefer.redraw = true;
}
const here1 = undefined;
const script1cmd = ['C:\\Program Files\\Git\\bin\\bash.exe', './example.sh'];
const script1Runner = new ProcessRunner(script1cmd, here1, script1ProcessRunnerOutputFunc);
const intDets: InterceptDetail[] = [{
  label: '[Q]uit',
  key: 'q',
  func: () => {
    //script1Runner.stop();
  }
}, {
  label: '[S]tart',
  key: 's',
  func: () => {
    //await script1Runner.start();
  }
}];
const leftNode = new InputInterupterNode(script1FeedNode, intDets);
script1Runner.start();



const script2FeedNode = new ScrollableFeedNode();
const script2ProcessRunnerOutputFunc = (str: string) => {
  script2FeedNode.sendLine(str);
  reefer.redraw = true;
}
const here2 = undefined;
const script2cmd = ['C:\\Program Files\\Git\\bin\\bash.exe', './example.sh'];
const script2Runner = new ProcessRunner(script2cmd, here2, script2ProcessRunnerOutputFunc);
const intDets2: InterceptDetail[] = [{
  label: '[Q]uit',
  key: 'q',
  func: async () => {
    await script2Runner.stop();
  }
}, {
  label: '[S]tart',
  key: 's',
  func: () => {
    script2Runner.start();
  }
}];
const rightNode = new InputInterupterNode(script2FeedNode, intDets2);
script2Runner.start();





const sideBySide = new SideBySideSelectable(leftNode, rightNode);

reefer.setMainNode(sideBySide);
reefer.setDebugFunc((s: string) => {
    script1FeedNode.sendLine(`debugFunc: ${s}`);
});
reefer.start();

script1FeedNode.sendLine('Starting...')

async function delay() {
  return await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
while(true){
    await delay(5);
}
//*/