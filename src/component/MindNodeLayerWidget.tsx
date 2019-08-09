import * as React from "react";
import { BaseWidget } from "./common/BaseWidget";
import { MindRootNodeWidget } from "./MindRootNodeWidget";
import { MindDiagramState } from "./MindDiagramState";
import { defaultDiagramConfig } from "../config/DiagramConfig";
import { MindDiagramModel } from "../model/MindDiagramModel";
import { MindMapModel } from "../model/MindMapModel";
import { MindMapModelModifier, OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../model/NodeModel";

export interface MindNodeLayerWidgetProps {
  diagramModel: MindDiagramModel;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScroll: (left: number, top: number) => void;
  setViewBoxScrollDelta: (left: number, top: number) => void;
}

export class MindNodeLayerWidget<
  P extends MindNodeLayerWidgetProps,
  S extends MindDiagramState
> extends BaseWidget<MindNodeLayerWidgetProps, MindDiagramState> {
  constructor(props: MindNodeLayerWidgetProps) {
    super(props);
    this.state = {
      mindMapModel: props.diagramModel.mindMapModel,
      zoom: props.diagramModel.zoom,
      config: Object.assign(defaultDiagramConfig, props.diagramModel.config),
      setMindMapModel(model: MindMapModel) {
        this.setState({
          mindMapModel: model
        });
      },
      setZoom(zoom: number) {
        this.setState({ zoom });
      },
      op: this.op
    };
  }

  op = (opType: OpType, key: NodeKeyType, arg) => {
    // console.error(`op:${opType}`);
    if (!key) key = this.state.mindMapModel.getFocusItemKey();
    let mindMapModel = MindMapModelModifier.op(
      this.state.mindMapModel,
      opType,
      key,
      arg
    );
    this.setState({
      mindMapModel
    });
  };

  render() {
    let { setViewBoxScroll, setViewBoxScrollDelta } = this.props;
    return (
      <div className="bm-node-layer" ref={this.props.saveRef("node-layer")}>
        {this.renderItems(setViewBoxScroll, setViewBoxScrollDelta)}
      </div>
    );
  }
  renderItems(setViewBoxScroll, setViewBoxScrollDelta) {
    let mindMapModel = this.state.mindMapModel;
    let editorRootItemKey = mindMapModel.getEditorRootItemKey();
    return (
      <MindRootNodeWidget
        diagramState={this.state}
        nodeKey={editorRootItemKey}
        saveRef={this.props.saveRef}
        getRef={this.props.getRef}
        setViewBoxScroll={setViewBoxScroll}
        setViewBoxScrollDelta={setViewBoxScrollDelta}
      />
    );
  }
}
