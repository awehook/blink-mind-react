import * as React from "react";
import { BaseWidget } from "./BaseWidget";

interface DragDropDestWidgetProps {
  onDragIn: Function;
  onDragOut: Function;
}

// Drag and Drop 时， 目标对象容器
export class DragDropDestWidget extends BaseWidget<DragDropDestWidgetProps> {
  onDragEnter = () => {
    if (this.props.onDragIn) this.props.onDragIn();
  };

  onDragLeave = () => {
    if (this.props.onDragOut) this.props.onDragOut();
  };

  render() {
    return (
      <div onDragEnter={this.onDragEnter}>
        onDragLeave={this.onDragLeave}
        {this.props.children}
      </div>
    );
  }
}
