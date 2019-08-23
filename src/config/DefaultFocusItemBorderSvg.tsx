import * as React from "react";
import { DiagramState } from "../interface/DiagramState";

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
    console.log('DefaultFocusItemBorderSvg render');
    return this.renderFocusItemBorder();
  }

  reLayout() {
    this.forceUpdate();
  }

  renderFocusItemBorder() {
    const { getRef, diagramState } = this.props;
    const { mindMapModel, config } = diagramState;
    const { focusBorderPadding } = config;

    const focusItemKey = mindMapModel.getFocusItemKey();
    if (focusItemKey) {
      let focusTopic: HTMLElement = getRef(`content-${focusItemKey}`);
      let nodeLayer: HTMLElement = getRef("node-layer");
      if (focusTopic && nodeLayer) {
        let focusTopicRect = focusTopic.getBoundingClientRect();
        let nodeLayerRect = nodeLayer.getBoundingClientRect();
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
