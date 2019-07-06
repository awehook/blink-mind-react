import * as React from "react";
import { NodeKeyType } from "../model/NodeModel";
import { BaseWidget } from "./BaseWidget";
import "./MindNodeWidget.scss";
import { MindDiagramState } from "./MindDiagramState";
import { OpType } from "../model/MindMapModelModifier";
import * as cx from "classnames";

export interface MindNodeWidgetProps {
  diagramState: MindDiagramState;
  nodeKey: NodeKeyType;
}

export interface MindNodeWidgetState {}

export class MindNodeWidget<
  P extends MindNodeWidgetProps,
  S extends MindNodeWidgetState
> extends BaseWidget<MindNodeWidgetProps, MindNodeWidgetState> {
  constructor(props: MindNodeWidgetProps) {
    super(props);
  }

  onClickCollapse = () => {
    this.props.diagramState.op(OpType.TOGGLE_COLLAPSE, this.props.nodeKey);
  };

  renderSubItems() {
    let { diagramState, nodeKey } = this.props;
    let { mindMapModel } = diagramState;
    let subItems = [];
    let node = mindMapModel.getItem(nodeKey);
    if (node.getSubItemKeys().size === 0) return null;
    node.getSubItemKeys().forEach(itemKey => {
      subItems.push(
        <MindNodeWidget
          key={itemKey}
          nodeKey={itemKey}
          diagramState={diagramState}
        />
      );
    });
    return <div className={cx("bm-children",{collapse: node.getCollapse()})}>{subItems}</div>;
  }

  render() {
    let { diagramState, nodeKey } = this.props;
    let { mindMapModel, config: diagramConfig } = diagramState;
    let node = mindMapModel.getItem(nodeKey);
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
      <div
        className="bm-node"
        style={{
          marginTop: diagramConfig.vMargin,
          marginBottom: diagramConfig.vMargin,
          marginLeft: diagramConfig.hMargin
        }}
      >
        <div className={cx("topic")}>
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
          <div
            className={cx("collapse-icon", {
              iconfont: node.getSubItemKeys().size > 0,
              [`bm-${node.getCollapse() ? "plus" : "minus"}`]:
                node.getSubItemKeys().size > 0
            })}
            onClick={this.onClickCollapse}
          />
        </div>
        {this.renderSubItems()}
      </div>
    );
  }
}
