import * as React from "react";
import { NodeKeyType } from "../model/NodeModel";
import { BaseWidget } from "./common/BaseWidget";
import { MindLinkWidget } from "./MindLinkWidget";
import "./MindNodeWidget.scss";
import { MindDiagramState } from "./MindDiagramState";
import { OpType } from "../model/MindMapModelModifier";
import * as cx from "classnames";
import { config } from "@storybook/addon-actions";

export enum MindNodeWidgetDirection {
  LEFT,
  RIGHT
}

export interface MindNodeWidgetProps {
  diagramState: MindDiagramState;
  nodeKey: NodeKeyType;
  dir: MindNodeWidgetDirection;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScroll: (left: number, top: number) => void;
  setViewBoxScrollDelta: (left: number, top: number) => void;
}

export interface MindNodeWidgetState {}

export class MindNodeWidget<
  P extends MindNodeWidgetProps,
  S extends MindNodeWidgetState
> extends BaseWidget<MindNodeWidgetProps, MindNodeWidgetState> {
  constructor(props: MindNodeWidgetProps) {
    super(props);
  }

  onClickCollapse = e => {
    console.log(`onClickCollapse`);
    e.stopPropagation();
    this.needRelocation = true;
    this.oldCollapseIconRect = this.collapseIcon.getBoundingClientRect();
    this.props.diagramState.op(OpType.TOGGLE_COLLAPSE, this.props.nodeKey);
  };

  onClickFocus = () => {
    this.props.diagramState.op(OpType.FOCUS_ITEM, this.props.nodeKey);
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
        let linkWidget: MindLinkWidget = getRef(linkKey);
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
    return true;
    if (nextProps.nodeKey !== this.props.nodeKey) return true;
    let nextItem = nextProps.diagramState.mindMapModel.getItem(
      nextProps.nodeKey
    );
    let item = this.props.diagramState.mindMapModel.getItem(this.props.nodeKey);
    if (nextItem !== item) return true;
    return false;
  }

  renderSubItems() {
    let {
      diagramState,
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
      let linkKey = `link-${nodeKey}-${itemKey}`;
      subLinks.push(
        <MindLinkWidget
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
      dir === MindNodeWidgetDirection.LEFT
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
    let { diagramState, nodeKey, dir, saveRef } = this.props;
    // if(nodeKey==='root_sub1') {
    //   console.log(`MindNode Render ${nodeKey}`);
    //   console.log(diagramState.mindMapModel.getItem(nodeKey).getContent());
    // }

    let { mindMapModel, config: diagramConfig } = diagramState;

    let node = mindMapModel.getItem(nodeKey);
    // console.log(node);
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
    let inlineStyle =
      dir === MindNodeWidgetDirection.LEFT
        ? {
            marginTop: diagramConfig.vMargin,
            marginBottom: diagramConfig.vMargin,
            marginRight: diagramConfig.hMargin
          }
        : {
            marginTop: diagramConfig.vMargin,
            marginBottom: diagramConfig.vMargin,
            marginLeft: diagramConfig.hMargin
          };
    return (
      <div className={cx("bm-node", `bm-dir-${dir}`)}>
        <div
          className={cx("topic", `bm-dir-${dir}`)}
          ref={saveRef(`topic-${nodeKey}`)}
        >
          <div
            className={cx("content", `content-dir-${dir}`, {
              "root-topic": visualLevel === 0,
              "primary-topic": visualLevel === 1,
              "normal-topic": visualLevel > 1
            })}
            style={itemStyle}
            onClick={this.onClickFocus}
          >
            {/*{node.getContent()}*/}
            {diagramConfig.editorRendererFn(diagramState, nodeKey)}
          </div>
          {node.getSubItemKeys().size > 0 ? (
            <div
              className={cx("collapse-line", {
                "collapse-line-hide": node.getCollapse(),
                [`normal-collapse-line-${dir}`]: visualLevel > 1
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
