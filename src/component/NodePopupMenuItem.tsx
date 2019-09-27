import * as React from "react";
import * as cx from "classnames";
import { OpType } from "../model/MindMapModelModifier";
import { DiagramState } from "../model/DiagramState";
import { NodeKeyType } from "../types/Node";
import { OpFunction } from "../types/FunctionType";
import styled from "styled-components";

const MenuItem = styled.div`
  display: inline-block;
  margin: 10px;
  &:hover {
    color: orange;
  }
  .icon {
    text-align: center;
  }
  .label {
    font-size: 20%;
  }
`;

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
      <MenuItem onClick={this.onClick}>
        <div
          className={cx("icon", "iconfont", `bm-${config.icon}`)}
          onClick={this.onClick}
        />
        <div className="label">{config.label}</div>
      </MenuItem>
    );
  }
}
