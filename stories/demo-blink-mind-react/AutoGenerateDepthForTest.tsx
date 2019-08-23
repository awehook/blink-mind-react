import * as React from "react";
import {
  DiagramWidget,
  MindDiagramModel,
  MindMapModel,
  DiagramConfig
} from "blink-mind-react";

import "./demo.css";
import { DiagramState } from "../../src/model/DiagramState";

function generateSubItemKeys(key:string,subItemCount: number) {
  return Array.from({length: subItemCount}, (x,i) => i+1).map((i)=>`${key}_sub${i}`);
}

function generateExampleItems(
  level: number,
  collapseLevel: number,
  parentKey: string,
  subItemCount: number = 2,
  curLevel: number = 0
) {
  let res = [];
  if (curLevel === level) {
    for(let i = 1; i<=subItemCount; i++) {
      res = res.concat({
        key: `${parentKey}_sub${i}`,
        parentKey,
        content: `${parentKey}_sub${i}`,
        subItemKeys: [],
        collapse: curLevel >= collapseLevel
      })
    }
  } else {
    for(let i = 1; i<=subItemCount; i++) {
      res = res.concat(
        {
          key: `${parentKey}_sub${i}`,
          parentKey,
          content: `${parentKey}_sub${i}`,
          subItemKeys: generateSubItemKeys(`${parentKey}_sub${i}`,subItemCount),
          collapse: curLevel >= collapseLevel
        });
      res = res.concat(generateExampleItems(level, collapseLevel,`${parentKey}_sub${i}`,subItemCount,curLevel+1));
    }
  }
  if(curLevel===0) {
    res = res.concat({
      key: parentKey, content: "root", subItemKeys: generateSubItemKeys(parentKey, subItemCount)
    });
  }
  return res;
}

interface DemoProps {}
interface DemoState {
  diagramState: DiagramState;
}
export class Demo extends React.Component<DemoProps, DemoState> {
  constructor(props) {
    super(props);
    let items = generateExampleItems(2,1,'root',4);
    let mindModel = MindMapModel.createWith({
      rootItemKey: "root",
      editorRootItemKey: "root",
      items: items
    });
    let diagramConfig : DiagramConfig = {
      hMargin: 10
    };
    let diagramState = DiagramState.createWith(mindModel, diagramConfig);
    this.state = {
      diagramState: diagramState
    };
  }

  onChange = (diagramState: DiagramState) => {
    this.setState({ diagramState });
  };

  render() {
    return (
      <DiagramWidget
        diagramState={this.state.diagramState}
        onChange={this.onChange}
      />
    );
  }
}

export default Demo;
