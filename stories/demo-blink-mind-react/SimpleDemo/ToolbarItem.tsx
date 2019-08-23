import * as React from "react";
import * as cx from "classnames";
import { NodeLayerWidget } from "../../../src/component/NodeLayerWidget";
import { OpType } from "../../../src/model/MindMapModelModifier";
import { DiagramState } from "../../../src/model/DiagramState";
import { OpFunction } from "../../../src/types/FunctionType";

export type ToolbarItemConfig = {
  icon: string;
  label: string;
  opType?: OpType;
  clickHandler?: (diagramState, nodeKey) => void;
};

interface MindToolbarItemProps {
  config: ToolbarItemConfig;
  diagramState: DiagramState;
  op: OpFunction
}

interface MindToolbarItemState {}

export class ToolbarItem extends React.Component<
  MindToolbarItemProps,
  MindToolbarItemState
> {
  constructor(props) {
    super(props);
  }
  onClick = ()=> {
    console.log('toolbar item click');
    let config = this.props.config;
    if(config.opType) {
      this.props.op(config.opType,null);
    }
  };
  render() {
    const { config } = this.props;
    return (
      <span className={cx("bm-toolbar-item","iconfont", `bm-${config.icon}`)} onClick={this.onClick}>
      </span>
    );
  }
}
