import * as React from "react";
import * as cx from "classnames";
import { BaseWidget } from "./common/BaseWidget";
import { FocusItemMode, NodeKeyType } from "../model/NodeModel";
import { DiagramState } from "../interface/DiagramState";

import { OpType } from "../model/MindMapModelModifier";
import { NodeWidgetDirection } from "../enums/NodeWidgetDirection";

import { NodePopupMenu } from "./NodePopupMenu";

interface TopicContentWidgetProps {
  diagramState: DiagramState;
  nodeKey: NodeKeyType;
  dir: NodeWidgetDirection;
  draggable: boolean;
  saveRef: Function;
  getRef: Function;
}

interface TopicContentWidgetState {
  dragEnter: boolean;
  showPopMenu: boolean;
}

let dragSrcItemKey: NodeKeyType = null;

export class TopicContentWidget extends BaseWidget<
  TopicContentWidgetProps,
  TopicContentWidgetState
> {
  constructor(props) {
    super(props);
    this.state = {
      dragEnter: false,
      showPopMenu: false
    };
  }

  onDragStart = e => {
    console.log("onDragStart");
    dragSrcItemKey = this.props.nodeKey;
    e.stopPropagation();
  };

  onDragOver = e => {
    e.preventDefault();
  };

  onDragEnter = () => {
    this.setState({
      dragEnter: true
    });
  };

  onDragLeave = e => {
    const { getRef, nodeKey } = this.props;
    let relatedTarget = e.nativeEvent.relatedTarget;
    let content = getRef(`content-${nodeKey}`);
    if (content == relatedTarget || content.contains(relatedTarget)) {
      return;
    }
    this.setState({
      dragEnter: false
    });
  };

  onDrop = e => {
    console.log("onDrop");
    let { diagramState, nodeKey } = this.props;
    diagramState.op(OpType.DRAG_AND_DROP, dragSrcItemKey, nodeKey);
    this.setState({
      dragEnter: false
    });
  };

  onClick = () => {
    console.log("TopicContentWidget onClick");
    let { diagramState, nodeKey } = this.props;
    if (diagramState.mindMapModel.getEditingItemKey() === nodeKey) return;
    // diagramState.op(OpType.SET_POPUP_MENU_ITEM_KEY, nodeKey);
    diagramState.op(OpType.SET_POPUP_MENU_ITEM_KEY, nodeKey);
    this.setState({ showPopMenu: true });
  };

  handlePopMenuVisibleChange = visible => {
    this.setState({
      showPopMenu: visible
    });
  };

  componentDidUpdate(
    prevProps: Readonly<TopicContentWidgetProps>,
    prevState: Readonly<TopicContentWidgetState>,
    snapshot?: any
  ): void {
    let { diagramState, nodeKey } = this.props;
    if (diagramState.mindMapModel.getEditingItemKey() === nodeKey) {
      document.addEventListener("click", this._handleClick);
    } else {
      document.removeEventListener("click", this._handleClick);
    }
  }

  _handleClick = e => {
    // console.log(`_handleClick ${this.props.nodeKey}`);
    // console.log(e);
    // console.log(e.target);

    let { getRef, nodeKey, diagramState } = this.props;
    let content = getRef(`content-${nodeKey}`);
    if (!content.contains(e.target)) {
      diagramState.op(OpType.SET_FOCUS_ITEM_MODE, nodeKey,FocusItemMode.Normal );
    }
  };

  render() {
    let { diagramState, nodeKey, dir, draggable, saveRef, getRef } = this.props;
    let { mindMapModel, config: diagramConfig } = diagramState;
    let visualLevel = mindMapModel.getItemVisualLevel(nodeKey);
    let itemStyle;
    switch (visualLevel) {
      case 0:
        itemStyle = diagramConfig.rootItemStyle;
        break;
      case 1:
        itemStyle = diagramConfig.primaryItemStyle;
        break;
      default:
        itemStyle = diagramConfig.normalItemStyle;
        break;
    }

    const showPopMenu =
      // mindMapModel.getPopupMenuItemKey() === nodeKey &&
      this.state.showPopMenu;
    return (
      <div
        draggable={draggable}
        className={cx("content", {
          [`content-dir-${dir}`]: dir !== NodeWidgetDirection.ROOT,
          "root-topic": visualLevel === 0,
          "primary-topic": visualLevel === 1,
          "normal-topic": visualLevel > 1,
          "content-drag-enter": this.state.dragEnter
        })}
        style={itemStyle}
        ref={saveRef(`content-${nodeKey}`)}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        onClick={this.onClick}
      >
        {diagramConfig.editorRendererFn(diagramState, nodeKey, saveRef)}
        {showPopMenu ? (
          <NodePopupMenu
            diagramState={diagramState}
            nodeKey={nodeKey}
            visible
            handleVisibleChange={this.handlePopMenuVisibleChange}
            getRef={getRef}
          />
        ) : null}
      </div>
    );
  }
}
