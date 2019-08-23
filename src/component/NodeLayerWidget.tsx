import * as React from "react";
import { BaseWidget } from "./common/BaseWidget";
import { RootNodeWidget } from "./RootNodeWidget";
import { DiagramState } from "../model/DiagramState";
import { defaultDiagramConfig } from "../config/DiagramConfig";
import { MindDiagramModel } from "../model/MindDiagramModel";
import { MindMapModel } from "../model/MindMapModel";
import { MindMapModelModifier, OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../model/NodeModel";
import { OpFunction } from "../types/FunctionType";

export interface MindNodeLayerWidgetProps {
  // diagramModel: MindDiagramModel;
  diagramState: DiagramState;
  op: OpFunction;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScroll: (left: number, top: number) => void;
  setViewBoxScrollDelta: (left: number, top: number) => void;
}

export class NodeLayerWidget<
  P extends MindNodeLayerWidgetProps
> extends BaseWidget<MindNodeLayerWidgetProps, DiagramState> {
  constructor(props: MindNodeLayerWidgetProps) {
    super(props);
  }

  render() {
    // console.error("MindNodeLayer render");

    let { setViewBoxScroll, setViewBoxScrollDelta, saveRef } = this.props;
    return (
      <div className="bm-node-layer" ref={saveRef("node-layer")}>
        {this.renderItems(setViewBoxScroll, setViewBoxScrollDelta)}
      </div>
    );
  }
  renderItems(setViewBoxScroll, setViewBoxScrollDelta) {
    let { diagramState, op, getRef, saveRef } = this.props;
    let mindMapModel = diagramState.mindMapModel;
    let editorRootItemKey = mindMapModel.getEditorRootItemKey();
    return (
      <RootNodeWidget
        diagramState={diagramState}
        op={op}
        nodeKey={editorRootItemKey}
        saveRef={saveRef}
        getRef={getRef}
        setViewBoxScroll={setViewBoxScroll}
        setViewBoxScrollDelta={setViewBoxScrollDelta}
      />
    );
  }
}
