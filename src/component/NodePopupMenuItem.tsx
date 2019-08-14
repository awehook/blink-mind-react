import * as React from "react";
import * as cx from "classnames";
import { OpType } from "../model/MindMapModelModifier";
import { DiagramState } from "../interface/DiagramState";
import { NodeKeyType } from "../model/NodeModel";

export type NodePopupMenuItemConfig = {
  icon: string;
  label: string;
  rootCanUse?: boolean;
  opType?: OpType;
};

interface NodePopupMenuItemProps {
  config: NodePopupMenuItemConfig;
  diagramState: DiagramState;
  nodeKey: NodeKeyType;
}

interface NodePopupMenuItemState {}

export class NodePopupMenuItem extends React.Component<
  NodePopupMenuItemProps,
  NodePopupMenuItemState
> {
  onClick = (e) => {
    e.stopPropagation();
    let { diagramState, nodeKey, config } = this.props;
    diagramState.op(config.opType, nodeKey);
  };
  render() {
    const { config } = this.props;
    return (
      <div className="popup-menu-item" onClick={this.onClick}>
        <div
          className={cx("icon", "iconfont", `bm-${config.icon}`)}
          onClick={this.onClick}
        />
        <div className="label">{config.label}</div>
      </div>
    );
  }
}
