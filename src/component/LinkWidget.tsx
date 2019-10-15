import * as React from 'react';
import { BaseWidget } from './common/BaseWidget';
import { DropDirType, NodeKeyType, NodeWidgetDirection } from '../types/Node';
import { DiagramState } from '../model/DiagramState';
import { isRectEqual } from '../util';
import styled from 'styled-components';
import debug from 'debug';
const log = debug('node:LinkWidget');
const logr = debug('render:LinkWidget');
const logd = debug('drop:LinkWidget');

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
  dropDir?: DropDirType;
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
    log('layout link %s => %s', this.props.fromNodeKey, this.props.toNodeKey);
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
    const { dir, getRef } = this.props;
    const partLayerElement: HTMLElement = getRef(
      `bm-node-layer-${dir === NodeWidgetDirection.LEFT ? 'left' : 'right'}`
    );
    if (partLayerElement) {
      this.partLayerRect = partLayerElement.getBoundingClientRect();
      this.partLayerRect = partLayerElement.getBoundingClientRect();
      this.setState({
        width: this.partLayerRect.width,
        height: this.partLayerRect.height
      });
    }
  }

  layoutNormal() {
    const { getRef, fromNodeKey } = this.props;
    // log('layoutNormal %s -> %s',fromNodeKey, toNodeKey);
    const fromNodeChildren: HTMLElement = getRef(`children-${fromNodeKey}`);
    if (fromNodeChildren) {
      this.fromChildrenRect = fromNodeChildren.getBoundingClientRect();
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
    const {
      isRoot,
      getRef,
      fromNodeKey,
      toNodeKey,
      diagramState,
      dropDir
    } = this.props;
    if (dropDir) {
      logd('shouldComponentUpdate:', dropDir);
      return true;
    }
    // log("shouldComponentUpdate %s->%s", fromNodeKey, toNodeKey);
    logr(
      diagramState.getConfig().theme,
      nextProps.diagramState.getConfig().theme
    );
    if (
      diagramState.getConfig().theme !==
      nextProps.diagramState.getConfig().theme
    )
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
    if (
      !isRoot &&
      !isRectEqual(this.prevFromChildrenRect, this.fromChildrenRect)
    ) {
      // log('not-root');
      return true;
    }
    this.fromTopicRect = getRef(`topic-${fromNodeKey}`).getBoundingClientRect();
    this.toTopicRect = getRef(`topic-${toNodeKey}`).getBoundingClientRect();
    log(
      '%s->%s',
      fromNodeKey,
      toNodeKey,
      this.prevFromTopicRect,
      this.fromTopicRect
    );
    log(
      '%s->%s',
      fromNodeKey,
      toNodeKey,
      this.prevToTopicRect,
      this.toTopicRect
    );
    if (
      isRectEqual(this.prevToTopicRect, this.toTopicRect) &&
      isRectEqual(this.prevFromTopicRect, this.fromTopicRect)
    ) {
      log('rect is equal');
      return false;
    }
    return true;
  }

  generatePath = () => {
    if (this.props.isRoot) return this.generatePathStringRoot();
    return this.generatePathStringForBorderNode();
  };

  generatePathStringForBorderNode = () => {
    const {
      fromNodeKey,
      toNodeKey,
      getRef,
      dir,
      diagramState,
      dropDir
    } = this.props;
    const fromItem = diagramState.getModel().getItem(fromNodeKey);
    const fromItemChildrenCount = fromItem.getSubItemKeys().size;
    const fromTopic: HTMLElement = getRef(`topic-${fromNodeKey}`);
    const toElementTopic: HTMLElement = getRef(`topic-${toNodeKey}`);
    if (!fromTopic || !toElementTopic) {
      return '';
    }
    const fromChildrenRect = getRef(
      `children-${fromNodeKey}`
    ).getBoundingClientRect();

    const toElementTopicRect = toElementTopic.getBoundingClientRect();
    const fromTopicRect = fromTopic.getBoundingClientRect();
    let fromX, fromY, toX, toY;
    const fakeDelta =
      dropDir != null
        ? dropDir === 'before'
          ? -(toElementTopicRect.height - 40)
          : toElementTopicRect.height - 40
        : 0;
    fromY = fromTopicRect.top + fromTopicRect.height / 2 - fromChildrenRect.top;
    if (dir === NodeWidgetDirection.RIGHT) {
      fromX = fromItemChildrenCount > 1 ? 1 : 0;

      toX = toElementTopicRect.left - fromTopicRect.right;
      toY =
        toElementTopicRect.top +
        toElementTopicRect.height / 2 -
        fromChildrenRect.top +
        fakeDelta;
    } else {
      fromX =
        fromTopicRect.left -
        fromChildrenRect.left -
        (fromItemChildrenCount > 1 ? 1 : 0);

      toX = toElementTopicRect.right - fromChildrenRect.left;
      toY =
        toElementTopicRect.top +
        toElementTopicRect.height / 2 -
        fromChildrenRect.top +
        fakeDelta;
    }
    return this.generatePathStringWithParameter(
      dir,
      fromX,
      fromY,
      toX,
      toY,
      dropDir,
      toElementTopicRect.width
    );
  };

  generatePathStringRoot = () => {
    const { fromNodeKey, toNodeKey, getRef, dir, dropDir } = this.props;
    // if (dropDir) logd("generatePathStringRoot");
    const rootTopic: HTMLElement = getRef(`topic-${fromNodeKey}`);
    const toElementTopic: HTMLElement = getRef(`topic-${toNodeKey}`);
    if (!rootTopic || !toElementTopic) {
      return '';
    }

    const toElementTopicRect = toElementTopic.getBoundingClientRect();
    const fakeDelta =
      dropDir != null
        ? dropDir === 'before'
          ? -(toElementTopicRect.height - 40)
          : toElementTopicRect.height - 40
        : 0;
    // if (dropDir) logd("fakeDelta:", fakeDelta);
    const rootTopicRect = rootTopic.getBoundingClientRect();
    let fromX, fromY, toX, toY, partLayerElement, partLayerRect;
    if (dir === NodeWidgetDirection.RIGHT) {
      partLayerElement = getRef('bm-node-layer-right');
      partLayerRect = partLayerElement.getBoundingClientRect();
      fromX = 0;

      toX = toElementTopicRect.left - rootTopicRect.right;
    } else {
      partLayerElement = getRef('bm-node-layer-left');
      partLayerRect = partLayerElement.getBoundingClientRect();
      fromX = partLayerRect.right - partLayerRect.left;
      toX = toElementTopicRect.right - partLayerRect.left;
    }
    fromY = rootTopicRect.top - partLayerRect.top + rootTopicRect.height / 2;
    toY =
      toElementTopicRect.top -
      partLayerRect.top +
      toElementTopicRect.height / 2 +
      fakeDelta;

    return this.generatePathStringWithParameter(
      dir,
      fromX,
      fromY,
      toX,
      toY,
      dropDir,
      toElementTopicRect.width
    );
  };

  generatePathStringWithParameter = (
    dir,
    fromX,
    fromY,
    toX,
    toY,
    dropFakeDir,
    fakeRectWidth
  ) => {
    let curve;
    if (fromY === toY) {
      curve = `M${fromX},${fromY}L${toX},${toY}`;
    } else {
      const centerX = (fromX + toX) / 2;
      const centerY = (fromY + toY) / 2;

      if (dir === NodeWidgetDirection.RIGHT) {
        curve = `M${fromX},${fromY}C${fromX},${centerY},${centerX},${toY},${toX},${toY}`;
      } else {
        curve = `M${toX},${toY}C${centerX},${toY},${fromX},${centerY},${fromX},${fromY}`;
      }
      log(this.props.toNodeKey, 'curve:', curve);
    }
    return (
      <g>
        <path d={curve} />
        {dropFakeDir && (
          <path
            d={this.generateFakeRectPathString(dir, toX, toY, fakeRectWidth)}
          />
        )}
      </g>
    );
  };

  generateFakeRectPathString = (dir, toX, toY, width) => {
    let res;
    const halfHeight = 8;
    if (dir === NodeWidgetDirection.RIGHT) {
      res = `M${toX},${toY - halfHeight}H${toX + width}V${toY +
        halfHeight}H${toX}V${toY - halfHeight}`;
    } else {
      res = `M${toX},${toY - halfHeight}H${toX - width}V${toY +
        halfHeight}H${toX}V${toY - halfHeight}`;
    }
    logd('generateFakeRectPathString', res);
    return res;
  };

  render() {
    this.prevFromChildrenRect = this.fromChildrenRect;
    this.prevPartLayerRect = this.partLayerRect;
    this.prevFromTopicRect = this.fromTopicRect;
    this.prevToTopicRect = this.toTopicRect;
    if (this.state && this.state.width) {
      logr('link %s->%s', this.props.fromNodeKey, this.props.toNodeKey);
      const strokeColor = this.props.diagramState.getThemeConfig().color
        .primary;
      logr(strokeColor);
      return (
        <Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            strokeWidth="2px"
            strokeDasharray={this.props.dropDir ? '5,5' : null}
            stroke={strokeColor}
            fill="none"
            {...this.state}
          >
            {this.generatePath()}
          </svg>
        </Link>
      );
    }
    return null;
  }
}
