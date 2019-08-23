import * as React from "react";
import {
  DiagramWidget,
  MindDiagramModel,
  MindMapModel,
  DiagramConfig,
  DiagramState
} from "blink-mind-react";

import "./index.scss";
import {Toolbar} from "./Toolbar";

interface DemoProps {}
interface DemoState {
  diagramState: DiagramState;
}
export class Demo extends React.Component<DemoProps, DemoState> {
  constructor(props) {
    super(props);
    let mindModel = MindMapModel.createWith({
      rootItemKey: "root",
      editorRootItemKey: "root",
      items: [
        { key: "root", content: "MainTopic", subItemKeys: ["sub1", "sub2"] },
        {
          key: "sub1",
          parentKey: "root",
          content: "SubTopic",
          subItemKeys: [],
          collapse: true
        },
        {
          key: "sub2",
          parentKey: "root",
          content: "SubTopic",
          subItemKeys: []
        }
      ]
    });
    let diagramConfig: DiagramConfig = {
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
      <div className='app'>
        <Toolbar diagramState={this.state.diagramState} onChange={this.onChange}/>
        <DiagramWidget
          diagramState={this.state.diagramState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default Demo;
