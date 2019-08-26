import * as React from "react";
import { ToolbarItem, ToolbarItemConfig } from "./ToolbarItem";
import "./Toolbar.scss";
import { OpType } from "../../../src/model/MindMapModelModifier";
import { DiagramState } from "../../../src/model/DiagramState";
import { OnChangeFunction } from "../../../src/types/FunctionType";
import { NodeKeyType } from "../../../src/types/Node";

interface MindToolbarProps {
  items?: Array<ToolbarItemConfig>;
  diagramState?: DiagramState;
  onChange?: OnChangeFunction
}

interface MindToolbarState {}

export class Toolbar extends React.Component<MindToolbarProps, MindToolbarState> {
  constructor(props) {
    super(props);
  }

  static defaultProps: MindToolbarProps = {
    items: [
      {
        icon: "newfile",
        label: "new file",
        // opType: OpType.REDO
      },
      {
        icon: "openfile",
        label: "open file",
        // opType: OpType.UNDO
      },
      {
        icon: "export",
        label: "export file",
        // opType: OpType.UNDO
      },
      {
        icon: "undo",
        label: "undo",
        opType: OpType.UNDO,
      },
      {
        icon: "redo",
        label: "redo",
        opType: OpType.REDO
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
      }
    ]
  };

  op = (opType: OpType, nodeKey:NodeKeyType, arg?)=> {
    let {diagramState,onChange} = this.props;
    let newState = DiagramState.op(diagramState,opType,nodeKey,arg);
    onChange(newState);
  };

  render(): React.ReactNode {
    let {items,diagramState} = this.props;
    let toolbarItems = items.map(item => (
      <ToolbarItem config={item} key={item.label} diagramState={diagramState} op={this.op} />
    ));
    return <div className="bm-toolbar">{toolbarItems}</div>;
  }
}
