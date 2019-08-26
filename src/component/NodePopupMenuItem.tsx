import * as React from "react";
import * as cx from "classnames";
import { OpType } from "../model/MindMapModelModifier";
import { DiagramState } from "../model/DiagramState";
import { NodeKeyType } from "../types/Node";
import { OpFunction } from "../types/FunctionType";

export type NodePopupMenuItemConfig = {
  icon: string;
  label: string;
  rootCanUse?: boolean;
  opType?: OpType;
  arg?: any;
};

interface NodePopupMenuItemProps {
  config: NodePopupMenuItemConfig;
  diagramState: DiagramState;
  op: OpFunction;
  nodeKey: NodeKeyType;
}

interface NodePopupMenuItemState {}

export class NodePopupMenuItem extends React.Component<
  NodePopupMenuItemProps,
  NodePopupMenuItemState
> {
  onClick = e => {
    e.stopPropagation();
    let { nodeKey, config, op } = this.props;
    if (config.opType) op(config.opType, nodeKey, config.arg);
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
