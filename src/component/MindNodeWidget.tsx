import * as React from "react";
import { MindMapModel } from "../model/MindMapModel";
import { NodeKeyType } from "../model/NodeModel";
import { BaseWidget } from "./BaseWidget";
import "./MindNodeWidget.scss";
import {node} from 'prop-types';
export interface MindNodeWidgetProps {
  mindMapModel: MindMapModel;
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

  renderSubItems() {
    let { mindMapModel, nodeKey } = this.props;
    let subItems = [];
    let node = mindMapModel.getItem(nodeKey);
    if(node.getSubItemKeys().size===0 || node.getCollapse())
      return null;
    node.getSubItemKeys().forEach((itemKey)=>{
      subItems.push(<MindNodeWidget key={itemKey} nodeKey={itemKey} mindMapModel={mindMapModel} />)
    });
    return (
      <div className="bm-children">
        {subItems}
      </div>
    )
  }

  render() {
    let { mindMapModel, nodeKey } = this.props;
    let node = mindMapModel.getItem(nodeKey);
    return (
      <div className="bm-node">
        <div className="content">{node.getContent()}</div>
        {this.renderSubItems()}
      </div>
    );
  }
}
