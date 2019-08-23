import * as React from "react";
import { BaseWidget } from "./common/BaseWidget";
import { DragScrollWidget } from "./common/DragScrollWidget";
import { NodeLayerWidget } from "./NodeLayerWidget";
import { DiagramState } from "../model/DiagramState";
import { OpFunction } from "../types/FunctionType";

export interface MindDragScrollWidgetProps {
  diagramState: DiagramState;
  op: OpFunction;
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
    let { getRef, diagramState } = this.props;
    let { mindMapModel } = diagramState;
    let rootTopic: HTMLElement = getRef(
      `topic-${mindMapModel.getEditorRootItemKey()}`
    );
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

  get dragScrollWidget(): DragScrollWidget {
    return this.props.getRef("DragScrollWidget");
  }
  // dragScrollWidgetRef = ref => {
  //   if (ref) {
  //     this.dragScrollWidget = ref;
  //   }
  // };
  canDragFunc = () => {
    let selection = document.getSelection();
    return (
      selection.anchorNode === null ||
      selection.anchorNode.nodeType !== Node.TEXT_NODE
    );
  };

  render() {
    const { saveRef } = this.props;
    console.log(`MindDragScrollWidget render`);
    return (
      <DragScrollWidget
        {...this.state}
        ref={saveRef("DragScrollWidget")}
        // canDragFunc={this.canDragFunc}
      >
        {(setViewBoxScroll, setViewBoxScrollDelta) => (
          <NodeLayerWidget
            {...this.props}
            setViewBoxScroll={setViewBoxScroll}
            setViewBoxScrollDelta={setViewBoxScrollDelta}
            ref={saveRef("MindNodeLayerWidget")}
          />
        )}
      </DragScrollWidget>
    );
  }
}
