import * as React from 'react';
import { BaseWidget } from './common/BaseWidget';
import { NodeKeyType, NodeWidgetDirection } from '../types/Node';
import { DiagramState } from '../model/DiagramState';
import { MindMapModelModifier, OpType } from '../model/MindMapModelModifier';
import { NodePopupMenu } from './NodePopupMenu';
import { OpFunction } from '../types/FunctionType';
import styled from 'styled-components';
import debug from 'debug';

const log = debug('node:topic');
const logr = debug('render:topic');

interface TopicContentProps {
  dragEnter: boolean;
  isRoot: boolean;
}

const TopicContent = styled.div<TopicContentProps>`
  display: flex;
  align-items: center;
  word-wrap: break-word;
  white-space: pre-line;
  cursor: pointer;
  overflow: hidden;
  background: ${props =>
    props.dragEnter
      ? props.theme.color.primary
      : props.isRoot
      ? props.theme.color.primary
      : null};
  //@ts-ignore
  padding: ${props => (props.isRoot ? '6px 0 6px 20px' : '6px 20px 6px 0')};
  border: 2px solid ${props => props.theme.color.primary};
`;

const DescIcon = styled.div`
  &:hover {
    color: ${props => props.theme.color.primary};
  }
`;

const DropArea = styled.div`
  height: 20px;
  width: 100%;
`;

interface TopicContentWidgetProps {
  diagramState: DiagramState;
  op: (...args: any[]) => void;
  nodeKey: NodeKeyType;
  dir: NodeWidgetDirection;
  draggable: boolean;
  saveRef: Function;
  getRef: Function;
  isRoot?: boolean;
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
    log('onDragStart');
    dragSrcItemKey = this.props.nodeKey;
    e.stopPropagation();
  };

  onDragOver = e => {
    e.preventDefault();
  };

  onDragEnter = e => {
    const { op, nodeKey } = this.props;
    const tag = e.nativeEvent.target.dataset.tag;
    if (
      MindMapModelModifier.canDragAndDrop(
        this.props.diagramState.getModel(),
        dragSrcItemKey,
        this.props.nodeKey,
        tag
      )
    ) {
      if (tag) {
        op(OpType.SET_DROP_AREA_KEY, `${tag}:${nodeKey}`);
        return;
      }
      this.setState({
        dragEnter: true
      });
    }
  };

  onDragLeave = e => {
    const { getRef, nodeKey, op } = this.props;
    const tag = e.nativeEvent.target.dataset.tag;
    if (tag) {
      op(OpType.SET_DROP_AREA_KEY, null);
      return;
    }
    const relatedTarget = e.nativeEvent.relatedTarget;
    const content = getRef(`content-${nodeKey}`);
    if (content == relatedTarget || content.contains(relatedTarget)) {
      return;
    }
    this.setState({
      dragEnter: false
    });
  };

  onDrop = e => {
    log('onDrop');
    const { nodeKey, op } = this.props;
    const tag = e.nativeEvent.target.dataset.tag;
    const clearDropArea = {
      opType: OpType.SET_DROP_AREA_KEY,
      nodeKey: null
    };
    if (tag) {
      op([
        clearDropArea,
        {
          opType: OpType.DRAG_AND_DROP,
          nodeKey: dragSrcItemKey,
          arg: { dstKey: nodeKey, dir: tag }
        }
      ]);
    } else {
      op([
        clearDropArea,
        {
          opType: OpType.DRAG_AND_DROP,
          nodeKey: dragSrcItemKey,
          arg: { dstKey: nodeKey, dir: 'in' }
        }
      ]);
      this.setState({
        dragEnter: false
      });
    }
  };

  isDoubleClick: boolean;

  onClick = () => {
    this.isDoubleClick = false;
    setTimeout(() => {
      if (!this.isDoubleClick) {
        // log("TopicContentWidget onClick");
        const { diagramState, op, nodeKey } = this.props;
        if (diagramState.getModel().getEditingContentItemKey() === nodeKey)
          return;
        op(OpType.SET_POPUP_MENU_ITEM_KEY, nodeKey);
        this.setState({ showPopMenu: true });
      }
    }, 200);
  };

  onDoubleClick = () => {
    this.isDoubleClick = true;
    // log('TopicContentWidget onDoubleClick');
    const { diagramState, op, nodeKey } = this.props;
    if (diagramState.getModel().getEditingContentItemKey() === nodeKey) return;
    op(OpType.START_EDITING_CONTENT, nodeKey);
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
    const { diagramState, nodeKey } = this.props;
    if (diagramState.getModel().getEditingContentItemKey() === nodeKey) {
      document.addEventListener('click', this._handleClick);
    } else {
      document.removeEventListener('click', this._handleClick);
    }
  }

  _handleClick = e => {
    log(`_handleClick ${this.props.nodeKey}`);
    const { getRef, nodeKey } = this.props;
    const content: HTMLElement = getRef(`content-${nodeKey}`);
    const contentRect = content.getBoundingClientRect();
    const extend = 40;
    const isInExtendBox =
      e.clientX > contentRect.left - extend &&
      e.clientX < contentRect.right + extend &&
      e.clientY > contentRect.top &&
      e.clientY < contentRect.bottom;
    if (!isInExtendBox) {
      // TODO 需要对编辑器进行修改，现在暂时有bug
      // this.props.op(OpType.FOCUS_ITEM, null);
    }
  };

  shouldComponentUpdate(
    nextProps: Readonly<TopicContentWidgetProps>,
    nextState: Readonly<TopicContentWidgetState>,
    nextContext: any
  ): boolean {
    if (
      this.state.dragEnter !== nextState.dragEnter ||
      this.state.showPopMenu !== nextState.showPopMenu
    )
      return true;
    const { diagramState: ds, nodeKey, dir } = this.props;
    const {
      diagramState: nextDS,
      nodeKey: nextNodeKey,
      dir: nextDir
    } = nextProps;
    if (nodeKey !== nextNodeKey || dir !== nextDir) return true;
    const mm = ds.getModel();
    const nextMm = nextDS.getModel();
    const focusKey = mm.getFocusItemKey();
    const nextFocusKey = nextMm.getFocusItemKey();
    if (focusKey === nodeKey || nextFocusKey == nodeKey) {
      if (nextFocusKey !== focusKey) return true;

      const focusMode = mm.getFocusItemMode();
      const nextFocusMode = nextMm.getFocusItemMode();
      if (nextFocusMode !== focusMode) return true;
    }
    const content = mm.getItem(nodeKey).getContent();
    const nextContent = nextMm.getItem(nodeKey).getContent();
    if (content !== nextContent) return true;
    return false;
  }

  render() {
    const {
      diagramState,
      op,
      nodeKey,
      dir,
      draggable,
      saveRef,
      getRef
    } = this.props;
    logr(nodeKey);
    const mindMapModel = diagramState.getModel();
    const config = diagramState.getConfig();
    const visualLevel = mindMapModel.getItemVisualLevel(nodeKey);
    let itemStyle;
    switch (visualLevel) {
      case 0:
        itemStyle = config.rootItemStyle;
        break;
      case 1:
        itemStyle = config.primaryItemStyle;
        break;
      default:
        itemStyle = config.normalItemStyle;
        break;
    }

    const item = mindMapModel.getItem(nodeKey);

    const showPopMenu =
      // mindMapModel.getPopupMenuItemKey() === nodeKey &&
      this.state.showPopMenu;
    const descString = item.descToString();
    const showDescIcon = descString !== null && descString !== '';

    return (
      <div>
        <DropArea
          data-tag="before"
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        />
        <TopicContent
          isRoot={dir === NodeWidgetDirection.ROOT}
          dragEnter={this.state.dragEnter}
          draggable={draggable}
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
          {config.editorRendererFn(diagramState, op, nodeKey, saveRef)}
          {showDescIcon && (
            <DescIcon
              className="iconfont bm-notes"
              onClick={e => {
                e.stopPropagation();
                op(OpType.START_EDITING_DESC, nodeKey);
              }}
            />
          )}
          {showPopMenu && (
            <NodePopupMenu
              diagramState={diagramState}
              op={op}
              nodeKey={nodeKey}
              visible
              handleVisibleChange={this.handlePopMenuVisibleChange}
              getRef={getRef}
            />
          )}
        </TopicContent>
        <DropArea
          data-tag="after"
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        />
      </div>
    );
  }
}
