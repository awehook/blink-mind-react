import * as React from 'react';
import { DiagramState } from '../model/DiagramState';

interface FocusItemBorderSvgProps {
  diagramState: DiagramState;
  saveRef?: Function;
  getRef?: Function;
}

interface FocusItemBorderSvgState {}

export class DefaultFocusItemBorderSvg extends React.Component<
  FocusItemBorderSvgProps,
  FocusItemBorderSvgState
> {
  render() {
    return this.renderFocusItemBorder();
  }

  reLayout() {
    this.forceUpdate();
  }

  renderFocusItemBorder() {
    const { getRef, diagramState } = this.props;
    const mindMapModel = diagramState.getMindMapModel();
    const config = diagramState.getConfig();
    const { focusBorderPadding } = config;

    const focusItemKey = mindMapModel.getFocusItemKey();
    if (focusItemKey) {
      const focusTopic: HTMLElement = getRef(`content-${focusItemKey}`);
      const nodeLayer: HTMLElement = getRef('node-layer');
      if (focusTopic && nodeLayer) {
        const focusTopicRect = focusTopic.getBoundingClientRect();
        const nodeLayerRect = nodeLayer.getBoundingClientRect();
        return (
          <div className="bm-focus-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              strokeWidth="2px"
              stroke="red"
              fill="none"
              width="3000px"
              height="3000px"
            >
              <rect
                x={`${focusTopicRect.left -
                  nodeLayerRect.left -
                  focusBorderPadding}`}
                y={`${focusTopicRect.top -
                  nodeLayerRect.top -
                  focusBorderPadding}`}
                rx="10"
                ry="10"
                width={`${focusTopicRect.width + 2 * focusBorderPadding}`}
                height={`${focusTopicRect.height + 2 * focusBorderPadding}`}
              />
            </svg>
          </div>
        );
      }
    }
    return null;
  }
}
