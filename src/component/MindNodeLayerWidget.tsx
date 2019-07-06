import * as React from "react";
import { MindMapModel } from "../model/MindMapModel";
import { NodeKeyType } from "../model/NodeModel";
import { MindDiagramModel } from "../model/MindDiagramModel";
import { BaseWidget } from "./BaseWidget";
import { MindNodeWidget } from "./MindNodeWidget";
import { MindDiagramState } from "./MindDiagramState";

export interface MindNodeLayerWidgetProps {
  diagramState: MindDiagramState;
}

export interface MindNodeLayerWidgetState {}

export class MindNodeLayerWidget<
  P extends MindNodeLayerWidgetProps,
  S extends MindNodeLayerWidgetState
> extends BaseWidget<MindNodeLayerWidgetProps, MindNodeLayerWidgetState> {
  constructor(props: MindNodeLayerWidgetProps) {
    super(props);
  }

  render() {
    let diagramState = this.props.diagramState;
    return <div className="bm-node-layer">{this.renderItems()}</div>;
  }
  renderItems() {
    let mindMapModel = this.props.diagramState.mindMapModel;
    let editorRootItemKey = mindMapModel.getEditorRootItemKey();
    return (
      <MindNodeWidget
        diagramState={this.props.diagramState}
        nodeKey={editorRootItemKey}
      />
    );
  }
}
