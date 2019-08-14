import * as React from "react";
import { ToolbarItem, ToolbarItemConfig } from "./ToolbarItem";
import "./Toolbar.scss";
import { OpType } from "../model/MindMapModelModifier";

interface MindToolbarProps {
  items?: Array<ToolbarItemConfig>;
  saveRef?: Function;
  getRef?: Function;
}

interface MindToolbarState {}

export class Toolbar extends React.Component<MindToolbarProps, MindToolbarState> {
  constructor(props) {
    super(props);
  }

  static defaultProps: MindToolbarProps = {
    items: [
      // {
      //   icon: "newfile",
      //   label: "new file",
      //   // opType: OpType.REDO
      // },
      // {
      //   icon: "openfile",
      //   label: "open file",
      //   // opType: OpType.UNDO
      // },

      {
        icon: "undo",
        label: "undo",
        opType: OpType.UNDO
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

  render(): React.ReactNode {
    let {getRef, items} = this.props;
    let toolbarItems = items.map(item => (
      <ToolbarItem config={item} key={item.label} getRef={getRef} />
    ));
    return <div className="bm-toolbar">{toolbarItems}</div>;
  }
}
