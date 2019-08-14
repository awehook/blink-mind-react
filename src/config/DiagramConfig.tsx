import * as React from 'react';
import { DefaultNodeContentEditor } from "./DefaultNodeContentEditor";
import { DefaultFocusItemBorderSvg } from "./DefaultFocusItemBorderSvg";
export enum DiagramLayoutDirection {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  LEFT_AND_RIGHT
}

export type DiagramConfig = {
  editable?: boolean;
  direction?: DiagramLayoutDirection;
  hMargin?: number;
  vMargin?: number;
  focusBorderPadding?: number;
  theme?: string;
  rootItemStyle?: any;
  primaryItemStyle?: any;
  normalItemStyle?: any;
  editorRendererFn?: (diagramState,nodeKey,saveRef)=>React.ReactNode;
  focusItemsBorderRenderFn?: (diagramState,saveRef,getRef)=>React.ReactNode;
};

const defaultEditorRendererFn = (diagramState,nodeKey,saveRef)=> {
  return <DefaultNodeContentEditor diagramState={diagramState} nodeKey={nodeKey} saveRef={saveRef}/>
};

const defaultFocusItemsBorderRenderFn = (diagramState,saveRef,getRef)=> {
  return <DefaultFocusItemBorderSvg diagramState={diagramState} saveRef={saveRef} getRef={getRef} ref={saveRef('focusItemBorderSvg')}/>
};

export const defaultDiagramConfig : DiagramConfig = {
  direction: DiagramLayoutDirection.LEFT_AND_RIGHT,
  hMargin: 10,
  vMargin: 10,
  focusBorderPadding: 5,
  theme: "theme-orange",
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
  editorRendererFn: defaultEditorRendererFn,
  focusItemsBorderRenderFn: defaultFocusItemsBorderRenderFn
};
