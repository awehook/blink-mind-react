import * as React from "react";
import { BaseWidget } from "./common/BaseWidget";
import { DragScrollWidget } from "./common/DragScrollWidget";
import { MindNodeLayerWidget } from "./MindNodeLayerWidget";
import { MindDiagramModel } from "blink-mind-react";

export interface MindDragScrollWidgetProps {
  diagramModel: MindDiagramModel;
  saveRef?: Function;
  getRef?: Function;
}

export class MindDragScrollWidget<
  P extends MindDragScrollWidgetProps
> extends BaseWidget<MindDragScrollWidgetProps> {
  constructor(props: MindDragScrollWidgetProps) {
    super(props);
  }

  componentDidMount(): void {
    // console.log("componentDidMount");
    let { getRef } = this.props;
    let rootTopic: HTMLElement = getRef("root-topic");
    let nodeLayer: HTMLElement = getRef("node-layer");
    let rootTopicRect = rootTopic.getBoundingClientRect();
    let nodeLayerRect = nodeLayer.getBoundingClientRect();
    // console.log(rootTopic.getBoundingClientRect());
    // console.log(rootItem.getBoundingClientRect());
    // console.log(this.dragScrollWidget.viewBox.getBoundingClientRect());
    // console.log(this.dragScrollWidget);
    this.dragScrollWidget.setViewBoxScrollDelta(
      0,
      rootTopicRect.top -
        nodeLayerRect.top -
        this.dragScrollWidget.viewBox.getBoundingClientRect().height / 2 +
        rootTopicRect.height
    );
  }

  dragScrollWidget: DragScrollWidget;
  dragScrollWidgetRef = ref => {
    if (ref) {
      this.dragScrollWidget = ref;
    }
  };

  render() {
    console.log(`MindDragScrollWidget render`);
    return (
      <DragScrollWidget {...this.state} ref={this.dragScrollWidgetRef}>
        {(setViewBoxScroll, setViewBoxScrollDelta) => (
          <MindNodeLayerWidget
            {...this.props}
            setViewBoxScroll={setViewBoxScroll}
            setViewBoxScrollDelta={setViewBoxScrollDelta}
          />
        )}
      </DragScrollWidget>
    );
  }
}
