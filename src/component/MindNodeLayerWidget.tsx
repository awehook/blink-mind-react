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

  renderItems() {
    let mindMapModel = this.props.diagramState.mindMapModel;
    let editorRootItemKey = mindMapModel.getEditorRootItemKey();
    return (
      <MindNodeWidget
        mindMapModel={mindMapModel}
        nodeKey={editorRootItemKey}
      />
    );
  }

  render() {
    let diagramState = this.props.diagramState;
    return (
      <div
        style={{
          transform:
            "translate(" +
            diagramState.offsetX +
            "px," +
            diagramState.offsetY +
            "px) scale(" +
            diagramState.zoom +
            ")"
        }}
      >
        {this.renderItems()}
      </div>
    );
  }
}
