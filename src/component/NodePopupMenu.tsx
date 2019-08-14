import * as React from "react";
import { NodeKeyType } from "../model/NodeModel";
import { DiagramState } from "../interface/DiagramState";
import {
  NodePopupMenuItemConfig,
  NodePopupMenuItem
} from "./NodePopupMenuItem";
import { OpType } from "../model/MindMapModelModifier";

interface NodePopupMenuProps {
  nodeKey: NodeKeyType;
  diagramState: DiagramState;
  visible: boolean;
  handleVisibleChange: Function;

  items?: Array<NodePopupMenuItemConfig>;
  saveRef?: Function;
  getRef?: Function;
}

interface NodePopupMenuState {}

export class NodePopupMenu extends React.Component<
  NodePopupMenuProps,
  NodePopupMenuState
> {
  static defaultProps = {
    items: [
      {
        icon: "edit",
        label: "edit",
        rootCanUse: true,
        opType: OpType.SET_EDIT_ITEM_KEY
      },
      {
        icon: "add-sibling",
        label: "add sibling",
        opType: OpType.ADD_SIBLING
      },
      {
        icon: "add-child",
        label: "add child",
        rootCanUse: true,
        opType: OpType.ADD_CHILD
      },
      {
        icon: "delete-node",
        label: "delete node",
        opType: OpType.DELETE_NODE
      }
    ]
  };
  componentDidMount() {
    document.addEventListener("click", this._handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this._handleClick);
  }

  _handleClick = event => {
    console.log("_handleClick");
    const { visible } = this.props;
    const wasOutside = !(event.target.contains === this.root);

    console.log(`wasOutside ${wasOutside}`);

    wasOutside &&
      visible &&
      this.props.handleVisibleChange &&
      this.props.handleVisibleChange(false);
  };

  root: HTMLElement;

  rootRef = ref => {
    this.root = ref;
  };

  render() {
    console.log("NodePopupMenu render:" + this.props.visible);
    let { visible, nodeKey, items, diagramState } = this.props;
    let editorRootKey = diagramState.mindMapModel.getEditorRootItemKey();
    let menuItems = items.map(item =>
      nodeKey === editorRootKey && !item.rootCanUse ? null : (
        <NodePopupMenuItem
          config={item}
          key={`${nodeKey}-${item.label}`}
          nodeKey={nodeKey}
          diagramState={diagramState}
        />
      )
    );
    return (
      visible && (
        <div className="bm-node-popup-menu" ref={this.rootRef}>
          {menuItems}
        </div>
      )
    );
  }
}
