import * as React from "react";
import { NodeKeyType, NodeStyle, NodeWidgetDirection } from "../types/Node";
import { BaseWidget } from "./common/BaseWidget";
import { LinkWidget } from "./LinkWidget";
import { TopicContentWidget } from "./TopicContentWidget";
import { DiagramState } from "../model/DiagramState";
import { OpType } from "../model/MindMapModelModifier";
import * as cx from "classnames";
import { OpFunction } from "../types/FunctionType";
import styled from "styled-components";
import debug from "debug";

const log = debug("node:NodeWidget");
const logr = debug("render:NodeWidget");

const Node = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  flex-direction: ${props =>
    //@ts-ignore
    props.dir === NodeWidgetDirection.RIGHT ? "row" : "row-reverse"};
`;

const NodeChildren = styled.div`
  position: relative;
`;

const NodeTopic = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: ${props =>
    //@ts-ignore
    props.dir === NodeWidgetDirection.RIGHT ? "row" : "row-reverse"};
`;

const CollapseLine = styled.div`
  height: 2px;
  width: 30px;
  //@ts-ignore
  background: ${props => (props.hide ? "transparent" : props.theme.color.primary)};
`;

const Icon = styled.div`
  position: relative;
  top: -8px;
  left: 5px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  background-color: ${props=>props.theme.color.primary};
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  line-height: 20px;
  border: 0;
`;

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
    e.stopPropagation();
    this.needRelocation = true;
    this.oldCollapseIconRect = this.collapseIcon.getBoundingClientRect();

    this.props.op(OpType.TOGGLE_COLLAPSE, this.props.nodeKey);
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
    // let nodeKey = nextProps.nodeKey;
    // let nextModel = nextProps.diagramState.mindMapModel;
    // let model = this.props.diagramState.mindMapModel;
    // let nextItem = nextModel.getItem(
    //   nodeKey
    // );
    // let item = model.getItem(nodeKey);
    //
    // if (nextItem !== item) return true;
    //
    // let nextFocusKey = nextModel.getFocusItemKey();
    // let focusKey = model.getFocusItemKey();
    // if(nextFocusKey!==focusKey && (nodeKey===nextFocusKey || nodeKey ===focusKey))
    //   return  true;
    //
    // let nextFocusMode = nextModel.getFocusItemMode();
    // let focusMode = model.getFocusItemMode();
    // if(nextFocusMode!==focusMode && (nodeKey===nextFocusKey || nodeKey ===focusKey))
    //   return true;
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
            // paddingTop: diagramConfig.vMargin,
            // paddingBottom: diagramConfig.vMargin,
            paddingRight: diagramConfig.hMargin
          }
        : {
            // paddingTop: diagramConfig.vMargin,
            // paddingBottom: diagramConfig.vMargin,
            paddingLeft: diagramConfig.hMargin
          };
    return (
      <NodeChildren style={inlineStyle} ref={saveRef(`children-${nodeKey}`)}>
        {subItems}
        {subLinks}
      </NodeChildren>
    );
  }

  render() {
    let { diagramState, op, nodeKey, dir, saveRef, getRef } = this.props;
    logr(nodeKey);
    let { mindMapModel } = diagramState;
    let node = mindMapModel.getItem(nodeKey);
    let visualLevel = mindMapModel.getItemVisualLevel(nodeKey);
    return (
      <Node
        //@ts-ignore
        dir={dir}
      >
        <NodeTopic
          //@ts-ignore
          dir={dir}
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
            <CollapseLine
              //@ts-ignore
              hide={node.getCollapse()}
              ref={saveRef(`line-${nodeKey}`)}
            >
              <Icon
                ref={this.collapseIconRef}
                className={cx({
                  iconfont: node.getSubItemKeys().size > 0,
                  [`bm-${node.getCollapse() ? "plus" : "minus"}`]:
                    node.getSubItemKeys().size > 0
                })}
                onClick={this.onClickCollapse}
              />
            </CollapseLine>
          ) : null}
        </NodeTopic>
        {this.renderSubItems()}
      </Node>
    );
  }
}
