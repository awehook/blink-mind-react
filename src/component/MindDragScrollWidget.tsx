import * as React from 'react';
import { BaseWidget } from './common/BaseWidget';
import { DragScrollWidget } from './common/DragScrollWidget';
import { NodeLayerWidget } from './NodeLayerWidget';
import { DiagramState } from '../model/DiagramState';
import { OpFunction } from '../types/FunctionType';

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
    const { getRef, diagramState } = this.props;
    const mindMapModel = diagramState.getModel();
    const rootTopic: HTMLElement = getRef(
      `topic-${mindMapModel.getEditorRootItemKey()}`
    );
    const nodeLayer: HTMLElement = getRef('node-layer');
    const rootTopicRect = rootTopic.getBoundingClientRect();
    const nodeLayerRect = nodeLayer.getBoundingClientRect();
    this.dragScrollWidget.setViewBoxScrollDelta(
      0,
      rootTopicRect.top -
        nodeLayerRect.top -
        this.dragScrollWidget.viewBox.getBoundingClientRect().height / 2 +
        rootTopicRect.height
    );
  }

  get dragScrollWidget(): DragScrollWidget {
    return this.props.getRef('DragScrollWidget');
  }
  canDragFunc = () => {
    const selection = document.getSelection();
    return (
      selection.anchorNode === null ||
      selection.anchorNode.nodeType !== Node.TEXT_NODE
    );
  };

  render() {
    const { saveRef } = this.props;
    return (
      <DragScrollWidget
        {...this.state}
        ref={saveRef('DragScrollWidget')}
        // canDragFunc={this.canDragFunc}
      >
        {(setViewBoxScroll, setViewBoxScrollDelta) => (
          <NodeLayerWidget
            {...this.props}
            setViewBoxScroll={setViewBoxScroll}
            setViewBoxScrollDelta={setViewBoxScrollDelta}
            ref={saveRef('MindNodeLayerWidget')}
          />
        )}
      </DragScrollWidget>
    );
  }
}
