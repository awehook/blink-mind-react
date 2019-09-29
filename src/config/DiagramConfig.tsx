import * as React from "react";
import { DefaultNodeContentEditor } from "./DefaultNodeContentEditor";
import { DefaultNodeDescEditor } from "./DefaultNodeDescEditor";
import { DefaultFocusItemBorderSvg } from "./DefaultFocusItemBorderSvg";
import { NodeStyle } from "../types/Node";
import themeConfigs from "./ThemeConfigs";

export enum DiagramLayoutDirection {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  LEFT_AND_RIGHT
}

export type DiagramConfig = {
  editable?: boolean;
  direction?: DiagramLayoutDirection;
  nodeStyle?: NodeStyle;
  hMargin?: number;
  vMargin?: number;
  focusBorderPadding?: number;
  theme?: string;
  themeConfigs?: object;
  rootItemStyle?: any;
  primaryItemStyle?: any;
  normalItemStyle?: any;
  editorRendererFn?: (diagramState, op, nodeKey, saveRef) => React.ReactNode;
  descEditorRenderFn?: (diagramState, op, nodeKey, saveRef) => React.ReactNode;
  focusItemsBorderRenderFn?: (diagramState, saveRef, getRef) => React.ReactNode;
};

const defaultEditorRendererFn = (diagramState, op, nodeKey, saveRef) => {
  return (
    <DefaultNodeContentEditor
      diagramState={diagramState}
      op={op}
      nodeKey={nodeKey}
      saveRef={saveRef}
    />
  );
};

const defaultDescEditorRendererFn = (diagramState, op, nodeKey, saveRef) => {
  return (
    <DefaultNodeDescEditor
      diagramState={diagramState}
      op={op}
      nodeKey={nodeKey}
      saveRef={saveRef}
    />
  );
};

const defaultFocusItemsBorderRenderFn = (diagramState, saveRef, getRef) => {
  return (
    <DefaultFocusItemBorderSvg
      diagramState={diagramState}
      saveRef={saveRef}
      getRef={getRef}
      ref={saveRef("focusItemBorderSvg")}
    />
  );
};

export const defaultDiagramConfig: DiagramConfig = {
  direction: DiagramLayoutDirection.LEFT_AND_RIGHT,
  nodeStyle: NodeStyle.ALL_HAS_BORDER,
  hMargin: 10,
  vMargin: 10,
  focusBorderPadding: 4,
  theme: "theme2",
  themeConfigs,
  rootItemStyle: {
    fontSize: "24px",
    borderRadius: "10px",
    padding: "10px 25px"
  },
  primaryItemStyle: {
    fontSize: "16px",
    borderRadius: "6px",
    padding: "0"
  },
  normalItemStyle: {
    fontSize: "16px",
    borderRadius: "6px",
    padding: "0"
  },
  editorRendererFn: defaultEditorRendererFn,
  descEditorRenderFn: defaultDescEditorRendererFn,
  focusItemsBorderRenderFn: defaultFocusItemsBorderRenderFn
};
