import * as React from "react";
import { NodeKeyType } from "../types/Node";
import { BaseWidget } from "./common/BaseWidget";
import { LinkWidget } from "./LinkWidget";
import { TopicContentWidget } from "./TopicContentWidget";
import { DiagramState } from "../model/DiagramState";
import { OpType } from "../model/MindMapModelModifier";
import * as cx from "classnames";
import { NodeWidgetDirection,NodeStyle } from "../types/Node";
import { OpFunction } from "../types/FunctionType";

export interface MindNodeWidgetProps {
  diagramState: DiagramState;
  op: OpFunction;
  nodeKey: NodeKeyType;
  dir: NodeWidgetDirection;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScroll: (left: number, top: number) => void;
  setViewBoxScrollDelta: (left: number, top: number) => void;
}

export interface MindNodeWidgetState {
  dragEnter: boolean;
}

export class NodeWidget<
  P extends MindNodeWidgetProps,
  S extends MindNodeWidgetState
> extends BaseWidget<MindNodeWidgetProps, MindNodeWidgetState> {
  constructor(props: MindNodeWidgetProps) {
    super(props);
    this.state = {
      dragEnter: false
    };
  }

  onClickCollapse = e => {
    console.log(`onClickCollapse`);
    e.stopPropagation();
    this.needRelocation = true;
    this.oldCollapseIconRect = this.collapseIcon.getBoundingClientRect();

    this.props.op(OpType.TOGGLE_COLLAPSE, this.props.nodeKey);
  };

  static dragSrcItemKey: NodeKeyType;

  onDragStart = e => {
    console.log("onDragStart");
    NodeWidget.dragSrcItemKey = this.props.nodeKey;
    e.stopPropagation();
  };

  onDragEnter = () => {
    console.log("onDragEnter");
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
    let { op, nodeKey } = this.props;
    op(OpType.DRAG_AND_DROP, NodeWidget.dragSrcItemKey, nodeKey);
    this.setState({
      dragEnter: false
    });
  };

  needRelocation: boolean = false;

  componentDidUpdate(
    prevProps: Readonly<MindNodeWidgetProps>,
    prevState: Readonly<MindNodeWidgetState>,
    snapshot?: any
  ): void {
    if (this.needRelocation) {
      let newRect = this.collapseIcon.getBoundingClientRect();
      this.props.setViewBoxScrollDelta(
        newRect.left - this.oldCollapseIconRect.left,
        newRect.top - this.oldCollapseIconRect.top
      );
      this.needRelocation = false;
    }
    this.layoutSubLinks();
  }

  componentDidMount() {
    this.layoutSubLinks();
  }

  layoutSubLinks = () => {
    let { diagramState, nodeKey, getRef } = this.props;
    let { mindMapModel } = diagramState;
    let node = mindMapModel.getItem(nodeKey);
    if (node.getSubItemKeys().size > 0 && !node.getCollapse()) {
      node.getSubItemKeys().forEach(itemKey => {
        let linkKey = `link-${nodeKey}-${itemKey}`;
        // @ts-ignore
        let linkWidget: LinkWidget = getRef(linkKey);
        linkWidget.layout();
      });
    }
  };

  collapseIconRef = ref => {
    if (ref) {
      this.collapseIcon = ref;
    }
  };
  collapseIcon: HTMLElement;
  oldCollapseIconRect: ClientRect;

  shouldComponentUpdate(
    nextProps: Readonly<MindNodeWidgetProps>,
    nextState: Readonly<MindNodeWidgetState>,
    nextContext: any
  ): boolean {
    // TODO 后面再进行优化
    return true;
    // if (nextProps.nodeKey !== this.props.nodeKey) return true;
    // let nextItem = nextProps.diagramState.mindMapModel.getItem(
    //   nextProps.nodeKey
    // );
    // let item = this.props.diagramState.mindMapModel.getItem(this.props.nodeKey);
    // if (nextItem !== item) return true;
    // return false;
  }

  renderSubItems() {
    let {
      diagramState,
      op,
      nodeKey,
      dir,
      setViewBoxScroll,
      setViewBoxScrollDelta,
      saveRef,
      getRef
    } = this.props;
    let { mindMapModel } = diagramState;
    let node = mindMapModel.getItem(nodeKey);
    if (node.getSubItemKeys().size === 0 || node.getCollapse()) return null;
    let subItems = [],
      subLinks = [];

    node.getSubItemKeys().forEach(itemKey => {
      subItems.push(
        <NodeWidget
          key={itemKey}
          nodeKey={itemKey}
          dir={dir}
          diagramState={diagramState}
          op={op}
          setViewBoxScroll={setViewBoxScroll}
          setViewBoxScrollDelta={setViewBoxScrollDelta}
          saveRef={saveRef}
          getRef={getRef}
        />
      );
      let linkKey = `link-${nodeKey}-${itemKey}`;
      subLinks.push(
        <LinkWidget
          diagramState={diagramState}
          key={linkKey}
          fromNodeKey={nodeKey}
          toNodeKey={itemKey}
          dir={dir}
          getRef={getRef}
          ref={saveRef(linkKey)}
        />
      );
    });
    let diagramConfig = diagramState.config;
    let inlineStyle =
      dir === NodeWidgetDirection.LEFT
        ? {
            paddingTop: diagramConfig.vMargin,
            paddingBottom: diagramConfig.vMargin,
            paddingRight: diagramConfig.hMargin
          }
        : {
            paddingTop: diagramConfig.vMargin,
            paddingBottom: diagramConfig.vMargin,
            paddingLeft: diagramConfig.hMargin
          };
    return (
      <div
        className={cx("bm-children")}
        style={inlineStyle}
        ref={saveRef(`children-${nodeKey}`)}
      >
        {subItems}
        {subLinks}
      </div>
    );
  }

  render() {
    let { diagramState, op, nodeKey, dir, saveRef, getRef } = this.props;
    let { mindMapModel } = diagramState;
    let node = mindMapModel.getItem(nodeKey);
    let visualLevel = mindMapModel.getItemVisualLevel(nodeKey);
    return (
      <div className={cx("bm-node", `bm-dir-${dir}`)}>
        <div
          className={cx("topic", `bm-dir-${dir}`)}
          ref={saveRef(`topic-${nodeKey}`)}
        >
          <TopicContentWidget
            diagramState={diagramState}
            op={op}
            nodeKey={nodeKey}
            dir={dir}
            draggable
            saveRef={saveRef}
            getRef={getRef}
          />
          {node.getSubItemKeys().size > 0 ? (
            <div
              className={cx("collapse-line", {
                "collapse-line-hide": node.getCollapse(),
                [`normal-collapse-line-${dir}`]:
                  diagramState.config.nodeStyle ===
                    NodeStyle.PRIMARY_HAS_BORDER_NORMAL_NO_BORDER &&
                  visualLevel > 1
              })}
              ref={saveRef(`line-${nodeKey}`)}
            >
              <div
                ref={this.collapseIconRef}
                className={cx("collapse-icon", {
                  iconfont: node.getSubItemKeys().size > 0,
                  [`bm-${node.getCollapse() ? "plus" : "minus"}`]:
                    node.getSubItemKeys().size > 0
                })}
                onClick={this.onClickCollapse}
              />
            </div>
          ) : null}
        </div>
        {this.renderSubItems()}
      </div>
    );
  }
}
