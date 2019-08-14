import * as React from "react";
import { NodeKeyType } from "../model/NodeModel";
import { BaseWidget } from "./common/BaseWidget";
import "./NodeWidget.scss";
import { DiagramState } from "../interface/DiagramState";
import * as cx from "classnames";
import { MindNodeModel } from "../model/MindNodeModel";
import { DiagramLayoutDirection } from "../config/DiagramConfig";
import { NodeWidget } from "./NodeWidget";
import { LinkWidget } from "./LinkWidget";
import { TopicContentWidget } from "./TopicContentWidget";
import { NodeWidgetDirection } from "../enums/NodeWidgetDirection";

export interface MindRootNodeWidgetProps {
  diagramState: DiagramState;
  nodeKey: NodeKeyType;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScroll: (left: number, top: number) => void;
  setViewBoxScrollDelta: (left: number, top: number) => void;
}

export interface MindNodeWidgetState {}

export class RootNodeWidget<
  P extends MindRootNodeWidgetProps,
  S extends MindNodeWidgetState
> extends BaseWidget<MindRootNodeWidgetProps, MindNodeWidgetState> {
  constructor(props: MindRootNodeWidgetProps) {
    super(props);
  }

  getNodeModel(): MindNodeModel {
    let { diagramState, nodeKey } = this.props;
    let { mindMapModel } = diagramState;
    return mindMapModel.getItem(nodeKey);
  }

  getPartItems(dir: DiagramLayoutDirection) {
    let node = this.getNodeModel();
    let subItemCount = node.getSubItemKeys().size;
    let items = node.getSubItemKeys().toArray();
    switch (dir) {
      case DiagramLayoutDirection.LEFT_TO_RIGHT:
        return [[], items];
      case DiagramLayoutDirection.RIGHT_TO_LEFT:
        return [items, []];
      case DiagramLayoutDirection.LEFT_AND_RIGHT:
        return [
          items.slice(Math.ceil(subItemCount / 2), subItemCount),
          items.slice(0, Math.ceil(subItemCount / 2))
        ];
    }
  }

  needRelocation: boolean = false;

  componentDidUpdate(
    prevProps: Readonly<MindRootNodeWidgetProps>,
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

  collapseIcon: HTMLElement;
  oldCollapseIconRect: ClientRect;



  // 以左右或者上下部分来分别进行渲染
  renderPartItems(items: string[], dir: NodeWidgetDirection) {
    let {
      diagramState,
      setViewBoxScroll,
      setViewBoxScrollDelta,
      saveRef,
      getRef
    } = this.props;

    if (items.length === 0) return null;
    let subItems = [];
    let subLinks = [];
    items.forEach(itemKey => {
      let linkKey = `link-${this.props.nodeKey}-${itemKey}`;
      subItems.push(
        <NodeWidget
          key={itemKey}
          nodeKey={itemKey}
          dir={dir}
          diagramState={diagramState}
          setViewBoxScroll={setViewBoxScroll}
          setViewBoxScrollDelta={setViewBoxScrollDelta}
          saveRef={saveRef}
          getRef={getRef}
        />
      );
      subLinks.push(
        <LinkWidget
          diagramState={diagramState}
          key={linkKey}
          ref={saveRef(linkKey)}
          fromNodeKey={this.props.nodeKey}
          toNodeKey={itemKey}
          dir={dir}
          saveRef={saveRef}
          getRef={getRef}
          isRoot
        />
      );
    });
    let cxName = `bm-node-layer-${
      dir === NodeWidgetDirection.LEFT ? "left" : "right"
    }`;
    return (
      <div className={cxName} ref={saveRef(cxName)}>
        {subItems}
        {subLinks}
      </div>
    );
  }

  render() {
    let { diagramState, nodeKey,saveRef,getRef } = this.props;
    let { mindMapModel, config: diagramConfig } = diagramState;
    let [leftItems, rightItems] = this.getPartItems(diagramConfig.direction);
    return (
      <>
        {this.renderPartItems(leftItems, NodeWidgetDirection.LEFT)}
        <div
          className={cx("topic")}
          ref={
            nodeKey === mindMapModel.getEditorRootItemKey()
              ? saveRef("root-topic")
              : null
          }
        >
          <TopicContentWidget diagramState={diagramState} nodeKey={nodeKey} dir={NodeWidgetDirection.ROOT} draggable={false} saveRef={saveRef} getRef={getRef}/>
        </div>
        {this.renderPartItems(rightItems, NodeWidgetDirection.RIGHT)}
      </>
    );
  }
}
