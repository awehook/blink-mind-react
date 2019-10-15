import * as React from 'react';
import { NodeKeyType, NodeWidgetDirection } from '../types/Node';
import { BaseWidget } from './common/BaseWidget';
import { DiagramState } from '../model/DiagramState';
import { MindNodeModel } from '../model/MindNodeModel';
import { DiagramLayoutDirection } from '../config/DiagramConfig';
import { LinkWidget } from './LinkWidget';
import { TopicContentWidget } from './TopicContentWidget';
import { OpFunction } from '../types/FunctionType';
import styled from 'styled-components';
import { createSubNodesAndSubLinks } from './utils';
import debug from 'debug';
const log = debug('render:RootNode');

const NodeLayerPart = styled.div`
  display: flex;
  position: relative;

  align-items: ${props =>
    //@ts-ignore
    props.dir === NodeWidgetDirection.LEFT ? 'flex-end' : 'flex-start'};
  flex-direction: column;

  padding: ${props =>
    //@ts-ignore
    props.dir === NodeWidgetDirection.LEFT
      ? '15px 60px 15px 0px'
      : '15px 0px 15px 60px'};
`;

const Topic = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`;

export interface MindRootNodeWidgetProps {
  diagramState: DiagramState;
  op: OpFunction;
  nodeKey: NodeKeyType;
  saveRef?: Function;
  getRef?: Function;
  setViewBoxScroll: (left: number, top: number) => void;
  setViewBoxScrollDelta: (left: number, top: number) => void;
}

export interface MindNodeWidgetState {}

export class RootNodeWidget<
  P extends MindRootNodeWidgetProps,
  S extends MindNodeWidgetState
> extends BaseWidget<MindRootNodeWidgetProps, MindNodeWidgetState> {
  constructor(props: MindRootNodeWidgetProps) {
    super(props);
  }

  getNodeModel(): MindNodeModel {
    const { diagramState, nodeKey } = this.props;
    return diagramState.getMindMapModel().getItem(nodeKey);
  }

  getPartItems(dir: DiagramLayoutDirection) {
    const node = this.getNodeModel();
    const subItemCount = node.getSubItemKeys().size;
    const items = node.getSubItemKeys().toArray();
    switch (dir) {
      case DiagramLayoutDirection.LEFT_TO_RIGHT:
        return [[], items];
      case DiagramLayoutDirection.RIGHT_TO_LEFT:
        return [items, []];
      case DiagramLayoutDirection.LEFT_AND_RIGHT:
        return [
          items.slice(Math.ceil(subItemCount / 2), subItemCount),
          items.slice(0, Math.ceil(subItemCount / 2))
        ];
    }
  }

  needRelocation: boolean = false;

  componentDidUpdate(
    prevProps: Readonly<MindRootNodeWidgetProps>,
    prevState: Readonly<MindNodeWidgetState>,
    snapshot?: any
  ): void {
    if (this.needRelocation) {
      const newRect = this.collapseIcon.getBoundingClientRect();
      this.props.setViewBoxScrollDelta(
        newRect.left - this.oldCollapseIconRect.left,
        newRect.top - this.oldCollapseIconRect.top
      );
      this.needRelocation = false;
    }
    this.layoutSubLinks();
  }

  componentDidMount() {
    this.layoutSubLinks();
  }

  layoutSubLinks = () => {
    const { getRef } = this.props;
    this.subLinksKeys.forEach(linkKey => {
      // @ts-ignore
      const linkWidget: LinkWidget = getRef(linkKey);
      linkWidget && linkWidget.layout();
    });
  };

  collapseIcon: HTMLElement;
  oldCollapseIconRect: ClientRect;
  subLinksKeys = [];

  // 以左右或者上下部分来分别进行渲染
  renderPartItems(items: string[], dir: NodeWidgetDirection) {
    const { saveRef } = this.props;

    if (items.length === 0) return null;
    const res = createSubNodesAndSubLinks(
      { ...this.props, dir, isRoot: true },
      items
    );
    if (!res) return null;
    const { subItems, subLinks, subLinksKeys } = res;
    this.subLinksKeys.push(...subLinksKeys);

    const cxName = `bm-node-layer-${
      dir === NodeWidgetDirection.LEFT ? 'left' : 'right'
    }`;
    return (
      //@ts-ignore
      <NodeLayerPart dir={dir} ref={saveRef(cxName)}>
        {subItems}
        {subLinks}
      </NodeLayerPart>
    );
  }

  render() {
    log('render');
    const { diagramState, op, nodeKey, saveRef, getRef } = this.props;
    const mindMapModel = diagramState.getMindMapModel();
    const config = diagramState.getConfig();
    const [leftItems, rightItems] = this.getPartItems(config.direction);
    this.subLinksKeys = [];
    return (
      <>
        {this.renderPartItems(leftItems, NodeWidgetDirection.LEFT)}
        <Topic
          ref={
            nodeKey === mindMapModel.getEditorRootItemKey()
              ? saveRef(`topic-${nodeKey}`)
              : null
          }
        >
          <TopicContentWidget
            diagramState={diagramState}
            op={op}
            nodeKey={nodeKey}
            dir={NodeWidgetDirection.ROOT}
            draggable={false}
            saveRef={saveRef}
            getRef={getRef}
          />
        </Topic>
        {this.renderPartItems(rightItems, NodeWidgetDirection.RIGHT)}
      </>
    );
  }
}
