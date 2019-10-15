import * as React from "react";
import { NodeKeyType } from "../types/Node";
import { DiagramState } from "../model/DiagramState";
import { NodePopupMenuItem, NodePopupMenuItemConfig } from "./NodePopupMenuItem";
import { OpType } from "../model/MindMapModelModifier";
import { OpFunction } from "../types/FunctionType";
import styled from "styled-components";
import debug from 'debug'
const log = debug('node:popup-menu');

const PopupMenu = styled.div`
  position: absolute;
  bottom: calc(100% + 5px);
  left: 0;
  padding: 0 8px;
  border-radius: 10px;
  background-color: white;
  box-shadow: rgb(170, 170, 170) 5px 5px 10px;
  cursor: pointer;
  z-index: 1;

  width: max-content;
  height: 50px;
`;

interface NodePopupMenuProps {
  nodeKey: NodeKeyType;
  diagramState: DiagramState;
  op: OpFunction;
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
        opType: OpType.START_EDITING_CONTENT
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
        icon: "notes",
        label: "edit notes",
        opType: OpType.START_EDITING_DESC,
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
    log("_handleClick");
    const { visible } = this.props;
    const wasOutside = !(event.target.contains === this.root);

    log(`wasOutside ${wasOutside}`);

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
    log("render:", this.props.visible);
    let { visible, nodeKey, items, diagramState, op } = this.props;
    let editorRootKey = diagramState.getMindMapModel().getEditorRootItemKey();
    let menuItems = items.map(item =>
      nodeKey === editorRootKey && !item.rootCanUse ? null : (
        <NodePopupMenuItem
          config={item}
          key={`${nodeKey}-${item.label}`}
          nodeKey={nodeKey}
          diagramState={diagramState}
          op={op}
        />
      )
    );
    return (
      visible && (
        <PopupMenu ref={this.rootRef}>
          {menuItems}
        </PopupMenu>
      )
    );
  }
}
