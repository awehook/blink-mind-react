import * as React from "react";
import { MindDiagramModel } from "../model/MindDiagramModel";
import { MindMapModel } from "../model/MindMapModel";
import { MindDiagramState } from "./MindDiagramState";
import { MindNodeLayerWidget } from "./MindNodeLayerWidget";
import { BaseWidget } from "./BaseWidget";
import "./MindDiagramWidget.scss";
export interface MindDiagramWidgetProps {
  diagramModel: MindDiagramModel;
}

export class MindDiagramWidget<
  P extends MindDiagramWidgetProps,
  S extends MindDiagramState
> extends BaseWidget<MindDiagramWidgetProps, MindDiagramState> {
  constructor(props: MindDiagramWidgetProps) {
    super(props);
    this.state = {
      mindMapModel: props.diagramModel.mindMapModel,
      offsetX: props.diagramModel.offsetX,
      offsetY: props.diagramModel.offsetY,
      zoom: props.diagramModel.zoom,
      setMindMapModel(model: MindMapModel) {
        this.setState({
          mindMapModel: model
        });
      },
      setOffset(x: number, y: number) {
        this.setState({
          offsetX: x,
          offsetY: y
        });
      },
      setZoom(zoom: number) {
        this.setState({ zoom });
      }
    };
  }

  viewElement: HTMLElement;
  viewRect: ClientRect;

  viewRef = ref => {
    if (ref) {
      this.viewElement = ref;
      this.viewRect = this.viewElement.getBoundingClientRect();
      // let mindMapModel = this.state.mindMapModel.this.state.setMindMapModel();
    }
  };

  render() {
    return (
      <div className="blink-mind-diagram" ref={this.viewRef}>
        <MindNodeLayerWidget diagramState={this.state} />
      </div>
    );
  }
}
