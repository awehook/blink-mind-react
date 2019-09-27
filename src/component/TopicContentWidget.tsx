import * as React from "react";
import * as cx from "classnames";
import { BaseWidget } from "./common/BaseWidget";
import { NodeKeyType, NodeWidgetDirection } from "../types/Node";
import { DiagramState } from "../model/DiagramState";
import { OpType } from "../model/MindMapModelModifier";
import { NodePopupMenu } from "./NodePopupMenu";
import { OpFunction } from "../types/FunctionType";
import styled from "styled-components";
import debug from "debug";
const log = debug("node:topic");

const TopicContent = styled.div`
  word-wrap: break-word;
  white-space: pre-line;
  cursor: pointer;
  overflow: hidden;
  background: ${props =>
    //@ts-ignore
    props.dragEnter ? "brown" : props.isRoot ? "orange" : null};
  //@ts-ignore
  padding: ${props => (props.isRoot ? "6px 0 6px 20px" : "6px 20px 6px 0")};
  border: 2px solid orange;
`;

interface TopicContentWidgetProps {
  diagramState: DiagramState;
  op: OpFunction;
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
    log("onDragStart");
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

  onDrop = () => {
    log("onDrop");
    let { nodeKey, op } = this.props;
    op(OpType.DRAG_AND_DROP, dragSrcItemKey, nodeKey);
    this.setState({
      dragEnter: false
    });
  };

  isDoubleClick: boolean;

  onClick = () => {
    this.isDoubleClick = false;
    setTimeout(() => {
      if (!this.isDoubleClick) {
        // log("TopicContentWidget onClick");
        let { diagramState, op, nodeKey } = this.props;
        if (diagramState.mindMapModel.getEditingItemKey() === nodeKey) return;
        op(OpType.SET_POPUP_MENU_ITEM_KEY, nodeKey);
        this.setState({ showPopMenu: true });
      }
    }, 200);
  };

  onDoubleClick = () => {
    this.isDoubleClick = true;
    // log('TopicContentWidget onDoubleClick');
    let { diagramState, op, nodeKey } = this.props;
    if (diagramState.mindMapModel.getEditingItemKey() === nodeKey) return;
    op(OpType.SET_EDIT_ITEM_KEY, nodeKey);
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
    log(`_handleClick ${this.props.nodeKey}`);
    let { getRef, nodeKey } = this.props;
    let content: HTMLElement = getRef(`content-${nodeKey}`);
    let contentRect = content.getBoundingClientRect();
    let extend = 40;
    let isInExtendBox =
      e.clientX > contentRect.left - extend &&
      e.clientX < contentRect.right + extend &&
      e.clientY > contentRect.top &&
      e.clientY < contentRect.bottom;
    if (!isInExtendBox) {
      // TODO 需要对编辑器进行修改，现在暂时有bug
      // this.props.op(OpType.FOCUS_ITEM, null);
    }
  };

  render() {
    let {
      diagramState,
      op,
      nodeKey,
      dir,
      draggable,
      saveRef,
      getRef
    } = this.props;
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
      <TopicContent
        //@ts-ignore
        isRoot={dir === NodeWidgetDirection.ROOT}
        dragEnter={this.state.dragEnter}
        draggable={draggable}
        // className={cx("content", {
        //   [`content-dir-${dir}`]: dir !== NodeWidgetDirection.ROOT,
        //   "root-topic": visualLevel === 0,
        //   "primary-topic": visualLevel === 1,
        //   "normal-topic": visualLevel > 1,
        //   "content-drag-enter": this.state.dragEnter
        // })}
        style={itemStyle}
        ref={saveRef(`content-${nodeKey}`)}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >
        {diagramConfig.editorRendererFn(diagramState, op, nodeKey, saveRef)}
        {showPopMenu ? (
          <NodePopupMenu
            diagramState={diagramState}
            op={op}
            nodeKey={nodeKey}
            visible
            handleVisibleChange={this.handlePopMenuVisibleChange}
            getRef={getRef}
          />
        ) : null}
      </TopicContent>
    );
  }
}
