import * as React from "react";
import * as cx from "classnames";
import { MindDiagramModel } from "../model/MindDiagramModel";
import { MindMapModel } from "../model/MindMapModel";
import { MindDiagramState } from "./MindDiagramState";
import { MindNodeLayerWidget } from "./MindNodeLayerWidget";
import { BaseWidget } from "./BaseWidget";
import "./MindDiagramWidget.scss";
import { defaultDiagramConfig, DiagramConfig } from "../config/DiagramConfig";
import { MindMapModelModifier, OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../model/NodeModel";

function log(obj) {
  console.log(obj);
}

export interface MindDiagramWidgetProps {
  diagramModel: MindDiagramModel;
  config?: DiagramConfig;
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
      config: Object.assign(defaultDiagramConfig, props.config),
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
      },
      op: this.op
    };
  }

  op = (opType: OpType, key: NodeKeyType, arg) => {
    this.setState({
      mindMapModel: MindMapModelModifier.op(
        this.state.mindMapModel,
        opType,
        key,
        arg
      )
    });
  };

  diagram: HTMLElement;
  viewRect: ClientRect;

  diagramRef = ref => {
    if (ref) {
      this.diagram = ref;
      this.diagram.scrollLeft = 1500;
      this.diagram.scrollTop = 800;
    }
  };

  onMouseDown = e => {
    this._lastCoordX = this.diagram.scrollLeft + e.nativeEvent.clientX;
    this._lastCoordY = this.diagram.scrollTop + e.nativeEvent.clientY;
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  };

  onMouseUp = e => {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  };

  onMouseMove = (e: MouseEvent) => {
    log(`onMouseMove`);
    log(e);
    log(this._lastCoordX- e.clientX);
    log(this._lastCoordY- e.clientY);
    this.diagram.scrollLeft = this._lastCoordX - e.clientX;
    this.diagram.scrollTop = this._lastCoordY - e.clientY;
    log(`${this.diagram.scrollLeft} ${this.diagram.scrollTop}`);
  };

  _lastCoordX: number;
  _lastCoordY: number;

  render() {
    return (
      <div
        className={cx("bm-diagram", { [`${this.state.config.theme}`]: true })}
        ref={this.diagramRef}
      >
        <div
          className="bm-container"

          onMouseDown={this.onMouseDown}
        >
          <MindNodeLayerWidget diagramState={this.state} />
        </div>
      </div>
    );
  }
}
