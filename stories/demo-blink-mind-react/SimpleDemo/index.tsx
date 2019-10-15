import * as React from "react";
import {
  DiagramWidget,
  MindMapModel,
  DiagramConfig,
  DiagramState, OpType, convertMindMapModelToRaw
} from "blink-mind-react";

import "./index.scss";
import {Toolbar} from "./Toolbar";
import {ToolbarItemConfig} from "./ToolbarItem";
import debug from 'debug';
const log = debug('app');

interface DemoProps {}
interface DemoState {
  diagramState: DiagramState;
}
export class Demo extends React.Component<DemoProps, DemoState> {
  constructor(props) {
    super(props);
    const mindModel = MindMapModel.createWith({
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
    const diagramConfig: DiagramConfig = {
      hMargin: 10
    };
    const diagramState = DiagramState.createWith(mindModel, diagramConfig);
    this.state = {
      diagramState: diagramState
    };
  }

  onChange = (diagramState: DiagramState) => {
    this.setState({ diagramState });
  };



  handleUndo = (diagramState: DiagramState) => {
    log('handleUndo');
    this.onChange(DiagramState.undo(diagramState));
  };

  handleRedo = (diagramState: DiagramState) => {
    log('handleRedo');
    this.onChange(DiagramState.redo(diagramState));
  };

  export = (diagramState: DiagramState) => {
    const obj = convertMindMapModelToRaw(diagramState.getModel());
    const json = JSON.stringify(obj);
    log(json);
  };

  toolbarItems: Array<ToolbarItemConfig> = [
    {
      icon: "newfile",
      label: "new file",
    },
    {
      icon: "openfile",
      label: "open file",
    },
    {
      icon: "export",
      label: "export file",
      clickHandler: this.export
    },
    {
      icon: "add-sibling",
      label: "add sibling",
      opType: OpType.ADD_SIBLING
    },
    {
      icon: "add-child",
      label: "add child",
      opType: OpType.ADD_CHILD,
    },
    {
      icon: "delete-node",
      label: "delete node",
      opType: OpType.DELETE_NODE,
    },
    {
      icon: "undo",
      label: "undo",
      clickHandler: this.handleUndo
    },
    {
      icon: "redo",
      label: "redo",
      clickHandler: this.handleRedo
    }
  ];

  render() {
    return (
      <div className='app'>
        <Toolbar items={this.toolbarItems} diagramState={this.state.diagramState} onChange={this.onChange}/>
        <DiagramWidget
          diagramState={this.state.diagramState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default Demo;
