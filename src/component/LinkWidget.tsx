import * as React from "react";
import { BaseWidget } from "./common/BaseWidget";
import { NodeKeyType, NodeStyle, NodeWidgetDirection } from "../types/Node";
import { DiagramState } from "../model/DiagramState";
import { isRectEqual } from "../util";
import styled from "styled-components";
import debug from "debug";
const log = debug("node:LinkWidget");
const logr = debug("render:LinkWidget");

const Link = styled.div`
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
`;

interface LinkWidgetProps {
  diagramState: DiagramState;
  isRoot?: boolean;
  fromNodeKey: NodeKeyType;
  toNodeKey: NodeKeyType;
  dir: NodeWidgetDirection;
  saveRef?: Function;
  getRef?: Function;
  registerRefListener?: Function;
}

interface LinkWidgetState {
  height: number;
  width: number;

  left: number;
  top: number;
}

export class LinkWidget<
  P extends LinkWidgetProps,
  S extends LinkWidgetState
> extends BaseWidget<LinkWidgetProps, LinkWidgetState> {
  constructor(props: LinkWidgetProps) {
    super(props);
  }

  static defaultProps = {
    isRoot: false
  };

  public layout() {
    log("layout link %s => %s", this.props.fromNodeKey, this.props.toNodeKey);
    this.props.isRoot ? this.layoutRoot() : this.layoutNormal();
  }

  prevPartLayerRect;
  prevFromChildrenRect;
  prevFromTopicRect;
  prevToTopicRect;

  partLayerRect;
  fromChildrenRect;
  fromTopicRect;
  toTopicRect;

  layoutRoot() {
    let { dir, getRef } = this.props;
    let partLayerElement: HTMLElement = getRef(
      `bm-node-layer-${dir === NodeWidgetDirection.LEFT ? "left" : "right"}`
    );
    if (partLayerElement) {
      this.partLayerRect = partLayerElement.getBoundingClientRect();
      if(isRectEqual(this.prevPartLayerRect,this.partLayerRect))
        return;
      this.setState({
        width: this.partLayerRect.width,
        height: this.partLayerRect.height
      });
    }
  }

  layoutNormal() {
    let { getRef, fromNodeKey } = this.props;
    // log('layoutNormal %s -> %s',fromNodeKey, toNodeKey);
    let fromNodeChildren: HTMLElement = getRef(`children-${fromNodeKey}`);
    if (fromNodeChildren) {
      this.fromChildrenRect = fromNodeChildren.getBoundingClientRect();
      if(isRectEqual(this.prevFromChildrenRect,this.fromChildrenRect))
        return;
      this.setState({
        width: this.fromChildrenRect.width,
        height: this.fromChildrenRect.height
      });
    }
  }

  shouldComponentUpdate(
    nextProps: Readonly<LinkWidgetProps>,
    nextState: Readonly<LinkWidgetState>,
    nextContext: any
  ): boolean {
    let { isRoot, getRef, fromNodeKey, toNodeKey,diagramState } = this.props;
    // log("shouldComponentUpdate %s->%s", fromNodeKey, toNodeKey);
    logr(diagramState.config.theme,nextProps.diagramState.config.theme);
    if(diagramState.config.theme!== nextProps.diagramState.config.theme)
      return true;
    if (
      fromNodeKey !== nextProps.fromNodeKey ||
      toNodeKey !== nextProps.toNodeKey
    )
      return true;
    // log(this.prevPartLayerRect,this.partLayerRect);
    if (isRoot && !isRectEqual(this.prevPartLayerRect, this.partLayerRect)) {
      // log('is-root');
      return true;
    }
    if (!isRoot && !isRectEqual(this.prevFromChildrenRect, this.fromChildrenRect)) {
      // log('not-root');
      return true;
    }
    this.fromTopicRect = getRef(`topic-${fromNodeKey}`).getBoundingClientRect();
    this.toTopicRect = getRef(`topic-${toNodeKey}`).getBoundingClientRect();
    log(
      "%s->%s",
      fromNodeKey,
      toNodeKey,
      this.prevFromTopicRect,
      this.fromTopicRect
    );
    log(
      "%s->%s",
      fromNodeKey,
      toNodeKey,
      this.prevToTopicRect,
      this.toTopicRect
    );
    if (
      isRectEqual(this.prevToTopicRect, this.toTopicRect) &&
      isRectEqual(this.prevFromTopicRect, this.fromTopicRect)
    ) {
      log("rect is equal");
      return false;
    }
    return true;
  }

  generatePathString = () => {
    if (this.props.isRoot) return this.generatePathStringRoot();
    if (
      this.props.diagramState.config.nodeStyle ===
      NodeStyle.PRIMARY_HAS_BORDER_NORMAL_NO_BORDER
    )
      return this.generatePathStringNormal();
    return this.generatePathStringForBorderNode();
  };

  generatePathStringForBorderNode = () => {
    let { fromNodeKey, toNodeKey, getRef, dir, diagramState } = this.props;
    let fromItem = diagramState.mindMapModel.getItem(fromNodeKey);
    let fromItemChildrenCount = fromItem.getSubItemKeys().size;
    let fromTopic: HTMLElement = getRef(`topic-${fromNodeKey}`);
    let toElementTopic: HTMLElement = getRef(`topic-${toNodeKey}`);
    if (!fromTopic || !toElementTopic) {
      return "";
    }
    let fromChildrenRect = getRef(
      `children-${fromNodeKey}`
    ).getBoundingClientRect();

    let toElementTopicRect = toElementTopic.getBoundingClientRect();
    let fromTopicRect = fromTopic.getBoundingClientRect();
    let fromX, fromY, toX, toY;
    if (dir === NodeWidgetDirection.RIGHT) {
      fromX = fromItemChildrenCount > 1 ? 1 : 0;
      fromY = Math.round(
        fromTopicRect.top + fromTopicRect.height / 2 - fromChildrenRect.top
      );
      toX = toElementTopicRect.left - fromTopicRect.right;
      toY = Math.round(
        toElementTopicRect.top +
          toElementTopicRect.height / 2 -
          fromChildrenRect.top
      );
    } else {
      fromX =
        fromTopicRect.left -
        fromChildrenRect.left -
        (fromItemChildrenCount > 1 ? 1 : 0);
      fromY = Math.round(
        fromTopicRect.top + fromTopicRect.height / 2 - fromChildrenRect.top
      );

      toX = Math.round(toElementTopicRect.right - fromChildrenRect.left);
      toY = Math.round(
        toElementTopicRect.top +
          toElementTopicRect.height / 2 -
          fromChildrenRect.top
      );
    }
    if (fromY === toY) return `M${fromX},${fromY}L${toX},${toY}`;

    let centerX = (fromX + toX) / 2;
    let centerY = (fromY + toY) / 2;

    if (dir === NodeWidgetDirection.RIGHT) {
      return `M${fromX},${fromY}C${fromX},${centerY},${centerX},${toY},${toX},${toY}`;
    } else {
      return `M${toX},${toY}C${centerX},${toY},${fromX},${centerY},${fromX},${fromY}`;
    }
  };

  generatePathStringNormal = () => {
    let cornerR = 10;
    let { fromNodeKey, toNodeKey, getRef, dir, diagramState } = this.props;
    let { mindMapModel } = diagramState;
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

    let fromItem = mindMapModel.getItem(fromNodeKey);

    if (dir === NodeWidgetDirection.RIGHT) {
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
      if (
        fromItem.getSubItemKeys().size === 1 &&
        mindMapModel.getItemVisualLevel(fromNodeKey) > 1
      ) {
        return `M${centerX},${cornerY}H${toElementTopicRect.right -
          fromElementChildrenRect.left}`;
      }
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
      if (
        fromItem.getSubItemKeys().size === 1 &&
        mindMapModel.getItemVisualLevel(fromNodeKey) > 1
      ) {
        return `M${centerX},${cornerY}H${fromElementLineRect.left -
          toElementTopicRect.right}`;
      }
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
    let { fromNodeKey, toNodeKey, getRef, dir } = this.props;
    let rootTopic: HTMLElement = getRef(`topic-${fromNodeKey}`);
    let toElementTopic: HTMLElement = getRef(`topic-${toNodeKey}`);
    if (!rootTopic || !toElementTopic) {
      return "";
    }

    let toElementTopicRect = toElementTopic.getBoundingClientRect();
    let rootTopicRect = rootTopic.getBoundingClientRect();
    let fromX, fromY, toX, toY;
    if (dir === NodeWidgetDirection.RIGHT) {
      let partLayerElement: HTMLElement = getRef("bm-node-layer-right");
      let partLayerRect = partLayerElement.getBoundingClientRect();
      fromX = 0;
      fromY = Math.round(
        rootTopicRect.top - partLayerRect.top + rootTopicRect.height / 2
      );
      toX = toElementTopicRect.left - rootTopicRect.right;
      toY = Math.round(
        toElementTopicRect.top -
          partLayerRect.top +
          toElementTopicRect.height / 2
      );
    } else {
      let partLayerElement: HTMLElement = getRef("bm-node-layer-left");
      let partLayerRect = partLayerElement.getBoundingClientRect();
      fromX = partLayerRect.right - partLayerRect.left;
      fromY = Math.round(
        rootTopicRect.top - partLayerRect.top + rootTopicRect.height / 2
      );

      toX = Math.round(toElementTopicRect.right - partLayerRect.left);
      toY = Math.round(
        toElementTopicRect.top -
          partLayerRect.top +
          toElementTopicRect.height / 2
      );
    }
    if (fromY === toY) return `M${fromX},${fromY}L${toX},${toY}`;

    let centerX = (fromX + toX) / 2;
    let centerY = (fromY + toY) / 2;

    if (dir === NodeWidgetDirection.RIGHT) {
      return `M${fromX},${fromY}C${fromX},${centerY},${centerX},${toY},${toX},${toY}`;
    } else {
      return `M${toX},${toY}C${centerX},${toY},${fromX},${centerY},${fromX},${fromY}`;
    }
  };
  render() {
    this.prevFromChildrenRect = this.fromChildrenRect;
    this.prevPartLayerRect = this.partLayerRect;
    this.prevFromTopicRect = this.fromTopicRect;
    this.prevToTopicRect = this.toTopicRect;
    if (this.state && this.state.width) {
      logr("link %s->%s", this.props.fromNodeKey, this.props.toNodeKey);
      let strokeColor = this.props.diagramState.getThemeConfig().color.primary;
      logr(strokeColor);
      return (
        <Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            strokeWidth="2px"
            stroke={strokeColor}
            fill="none"
            {...this.state}
          >
            <g>
              <path d={this.generatePathString()} />
            </g>
          </svg>
        </Link>
      );
    }
    return null;
  }
}
