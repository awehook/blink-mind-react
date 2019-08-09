import * as React from "react";
import { BaseWidget } from "./common/BaseWidget";
import { NodeKeyType } from "../model/NodeModel";
import { MindNodeWidgetDirection } from "./MindNodeWidget";

// import { MindDiagramState } from "./MindDiagramState";

interface MindLinkWidgetProps {
  // diagramState: MindDiagramState
  isRoot?: boolean;
  fromNodeKey: NodeKeyType;
  toNodeKey: NodeKeyType;
  dir: MindNodeWidgetDirection;
  saveRef?: Function;
  getRef?: Function;
  registerRefListener?: Function;
}

interface MindLinkWidgetState {
  height: number;
  width: number;
}

export class MindLinkWidget<
  P extends MindLinkWidgetProps,
  S extends MindLinkWidgetState
> extends BaseWidget<MindLinkWidgetProps, MindLinkWidgetState> {
  constructor(props: MindLinkWidgetProps) {
    super(props);
  }

  static defaultProps = {
    isRoot: false
  };

  public layout() {
    // console.log(
    //   `layout link ${this.props.fromNodeKey} ${this.props.toNodeKey}`
    // );
    this.props.isRoot ? this.layoutRoot() : this.layoutNormal();
  }
  layoutRoot() {
    let { dir, getRef } = this.props;
    let partLayerElement: HTMLElement = getRef(
      `bm-node-layer-${dir === MindNodeWidgetDirection.LEFT ? "left" : "right"}`
    );
    if (partLayerElement) {
      let partLayerElementRect = partLayerElement.getBoundingClientRect();
      this.setState({
        width: partLayerElementRect.width,
        height: partLayerElementRect.height
      });
    }
  }

  layoutNormal() {
    let fromNodeChildren: HTMLElement = this.props.getRef(
      `children-${this.props.fromNodeKey}`
    );
    if (fromNodeChildren) {
      let fromNodeChildrenRect = fromNodeChildren.getBoundingClientRect();
      this.setState({
        width: fromNodeChildrenRect.width,
        height: fromNodeChildrenRect.height
      });
    }
  }

  generatePathString = () => {
    return this.props.isRoot
      ? this.generatePathStringRoot()
      : this.generatePathStringNormal();
  };
  generatePathStringNormal = () => {
    let cornerR = 10;
    let { fromNodeKey, toNodeKey, getRef, dir } = this.props;
    let fromElementTopic: HTMLElement = getRef(`topic-${fromNodeKey}`);
    let toElementTopic: HTMLElement = getRef(`topic-${toNodeKey}`);
    if (!fromElementTopic || !toElementTopic) {
      return "";
    }
    let fromElementLine: HTMLElement = getRef(`line-${fromNodeKey}`);
    let fromElementChildren: HTMLElement = getRef(`children-${fromNodeKey}`);
    let toElementTopicRect = toElementTopic.getBoundingClientRect();
    let fromElementLineRect = fromElementLine.getBoundingClientRect();
    let fromElementChildrenRect = fromElementChildren.getBoundingClientRect();
    if (dir === MindNodeWidgetDirection.RIGHT) {
      let centerX = 0;
      let centerY = Math.round(
        fromElementLineRect.top - fromElementChildrenRect.top + 1
      );
      let cornerX = Math.round(
        toElementTopicRect.left - fromElementChildrenRect.left - 10
      );
      let cornerY = Math.round(
        toElementTopicRect.bottom - fromElementChildrenRect.top
      );
      let rightX = Math.round(
        toElementTopicRect.right - fromElementChildrenRect.left - 12
      );
      if (centerY > cornerY)
        return `M${centerX},${centerY} H${cornerX} V${cornerY +
          cornerR} Q${cornerX},${cornerY} ${cornerX +
          cornerR},${cornerY} H${rightX}`;
      else
        return `M${centerX},${centerY} H${cornerX} V${cornerY -
          cornerR} Q${cornerX},${cornerY} ${cornerX +
          cornerR},${cornerY} H${rightX}`;
    } else {
      let centerX = Math.round(
        fromElementLineRect.left - fromElementChildrenRect.left
      );
      let centerY = Math.round(
        fromElementLineRect.top - fromElementChildrenRect.top + 1
      );
      let cornerX = Math.round(
        toElementTopicRect.right - fromElementChildrenRect.left + 10
      );
      let cornerY = Math.round(
        toElementTopicRect.bottom - fromElementChildrenRect.top
      );
      let rightX = Math.round(
        toElementTopicRect.left - fromElementChildrenRect.left + 12
      );
      if (centerY > cornerY)
        return `M${centerX},${centerY} H${cornerX} V${cornerY +
          cornerR} Q${cornerX},${cornerY} ${cornerX -
          cornerR},${cornerY} H${rightX}`;
      else
        return `M${centerX},${centerY} H${cornerX} V${cornerY -
          cornerR} Q${cornerX},${cornerY} ${cornerX -
          cornerR},${cornerY} H${rightX}`;
    }
  };

  generatePathStringRoot = () => {
    let cornerR = 10;
    let { toNodeKey, getRef, dir } = this.props;
    let rootTopic: HTMLElement = getRef(`root-topic`);
    let toElementTopic: HTMLElement = getRef(`topic-${toNodeKey}`);
    if (!rootTopic || !toElementTopic) {
      return "";
    }

    let toElementTopicRect = toElementTopic.getBoundingClientRect();
    let rootTopicRect = rootTopic.getBoundingClientRect();
    if (dir === MindNodeWidgetDirection.RIGHT) {
      let partLayerElement: HTMLElement = getRef("bm-node-layer-right");
      let partLayerRect = partLayerElement.getBoundingClientRect();
      let centerX = 0;
      let centerY = Math.round(
        rootTopicRect.top - partLayerRect.top + rootTopicRect.height / 2
      );

      let rightX = Math.round(toElementTopicRect.left - partLayerRect.left);
      let cornerX = (rightX + centerX) / 2;
      let cornerY = Math.round(
        toElementTopicRect.top -
          partLayerRect.top +
          toElementTopicRect.height / 2
      );
      if (centerY > cornerY)
        return `M${centerX},${centerY} H${cornerX} V${cornerY +
          cornerR} Q${cornerX},${cornerY} ${cornerX +
          cornerR},${cornerY} H${rightX}`;
      else
        return `M${centerX},${centerY} H${cornerX} V${cornerY -
          cornerR} Q${cornerX},${cornerY} ${cornerX +
          cornerR},${cornerY} H${rightX}`;
    } else {
      let partLayerElement: HTMLElement = getRef("bm-node-layer-left");
      let partLayerRect = partLayerElement.getBoundingClientRect();
      let centerX = partLayerRect.right - partLayerRect.left;
      let centerY = Math.round(
        rootTopicRect.top - partLayerRect.top + rootTopicRect.height / 2
      );

      let rightX = Math.round(toElementTopicRect.right - partLayerRect.left);
      let cornerX = (rightX + centerX) / 2;
      let cornerY = Math.round(
        toElementTopicRect.top -
          partLayerRect.top +
          toElementTopicRect.height / 2
      );
      if (centerY > cornerY)
        return `M${centerX},${centerY} H${cornerX} V${cornerY +
          cornerR} Q${cornerX},${cornerY} ${cornerX -
          cornerR},${cornerY} H${rightX}`;
      else
        return `M${centerX},${centerY} H${cornerX} V${cornerY -
          cornerR} Q${cornerX},${cornerY} ${cornerX -
          cornerR},${cornerY} H${rightX}`;
    }
  };
  render() {
    // console.log(
    //   `render link ${this.props.fromNodeKey} ${this.props.toNodeKey}`
    // );
    if (this.state && this.state.width) {
      // console.log(
      //   `render link ${this.props.fromNodeKey} ${this.props.toNodeKey} ==>`
      // );
      return (
        <div className="bm-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            strokeWidth="2px"
            stroke="orange"
            fill="none"
            {...this.state}
          >
            <g>
              <path d={this.generatePathString()} />
            </g>
          </svg>
        </div>
      );
    }
    return null;
  }
}
