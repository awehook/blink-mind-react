import * as React from "react";
import { NodeKeyType } from "../model/NodeModel";
import { BaseWidget } from "./common/BaseWidget";
import "./MindNodeWidget.scss";
import { MindDiagramState } from "./MindDiagramState";
import { OpType } from "../model/MindMapModelModifier";
import * as cx from "classnames";
import { MindNodeModel } from "../model/MindNodeModel";
import { DiagramLayoutDirection } from "../config/DiagramConfig";
import { MindNodeWidget, MindNodeWidgetDirection } from "./MindNodeWidget";
import { MindLinkWidget } from "./MindLinkWidget";

export interface MindRootNodeWidgetProps {
  diagramState: MindDiagramState;
  nodeKey: NodeKeyType;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScroll: (left: number, top: number) => void;
  setViewBoxScrollDelta: (left: number, top: number) => void;
}

export interface MindNodeWidgetState {}

export class MindRootNodeWidget<
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
        let linkWidget: MindLinkWidget = getRef(linkKey);
        linkWidget.layout();
      });
    }
  };

  collapseIcon: HTMLElement;
  oldCollapseIconRect: ClientRect;

  renderItems(items: string[], dir: MindNodeWidgetDirection) {
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
        <MindNodeWidget
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
        <MindLinkWidget
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
      dir === MindNodeWidgetDirection.LEFT ? "left" : "right"
    }`;
    return (
      <div className={cxName} ref={saveRef(cxName)}>
        {subItems}
        {subLinks}
      </div>
    );
  }

  render() {
    let { diagramState, nodeKey,saveRef } = this.props;
    let { mindMapModel, config: diagramConfig } = diagramState;
    let node = mindMapModel.getItem(nodeKey);
    let [leftItems, rightItems] = this.getPartItems(diagramConfig.direction);
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
    return (
      <>
        {this.renderItems(leftItems, MindNodeWidgetDirection.LEFT)}
        <div
          className={cx("topic")}
          ref={
            nodeKey === mindMapModel.getEditorRootItemKey()
              ? saveRef("root-topic")
              : null
          }
        >
          <div
            className={cx("content", {
              "root-topic": visualLevel === 0,
              "primary-topic": visualLevel === 1,
              "normal-topic": visualLevel > 1
            })}
            style={itemStyle}
          >
            {node.getContent()}
          </div>
        </div>
        {this.renderItems(rightItems, MindNodeWidgetDirection.RIGHT)}
      </>
    );
  }
}
