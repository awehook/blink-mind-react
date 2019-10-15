import * as React from 'react';
import { LinkWidget } from '../LinkWidget';
import { NodeWidget } from '../NodeWidget';

export function createSubNodesAndSubLinks(props, items) {
  const {
    diagramState,
    op,
    nodeKey,
    dir,
    setViewBoxScroll,
    setViewBoxScrollDelta,
    saveRef,
    getRef,
    isRoot
  } = props;
  const mindMapModel = diagramState.getModel();
  const node = mindMapModel.getItem(nodeKey);
  const dropAreaKey = mindMapModel.getDropAreaKey();
  let dropArea;
  if (dropAreaKey !== null) dropArea = dropAreaKey.split(':');
  if (items.size === 0 || node.getCollapse()) return null;
  const subItems = [],
    subLinks = [],
    subLinksKeys = [];

  items.forEach(itemKey => {
    subItems.push(
      <NodeWidget
        key={itemKey}
        nodeKey={itemKey}
        dir={dir}
        diagramState={diagramState}
        op={op}
        setViewBoxScroll={setViewBoxScroll}
        setViewBoxScrollDelta={setViewBoxScrollDelta}
        saveRef={saveRef}
        getRef={getRef}
      />
    );
    let linkKey = `link-${nodeKey}-${itemKey}`;
    subLinks.push(
      <LinkWidget
        diagramState={diagramState}
        key={linkKey}
        fromNodeKey={nodeKey}
        toNodeKey={itemKey}
        dir={dir}
        getRef={getRef}
        ref={saveRef(linkKey)}
        isRoot={isRoot}
      />
    );
    subLinksKeys.push(linkKey);
    if (dropAreaKey !== null && itemKey === dropArea[1]) {
      linkKey = `link-${nodeKey}-${itemKey}-${dropArea[0]}`;
      subLinksKeys.push(linkKey);
      subLinks.push(
        <LinkWidget
          diagramState={diagramState}
          key={linkKey}
          fromNodeKey={nodeKey}
          toNodeKey={itemKey}
          dir={dir}
          getRef={getRef}
          ref={saveRef(linkKey)}
          dropDir={dropArea[0]}
          isRoot={isRoot}
        />
      );
    }
  });

  return {
    subItems,
    subLinks,
    subLinksKeys
  };
}
