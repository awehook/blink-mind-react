import * as React from 'react';
import { DefaultNodeContentEditor } from "./DefaultNodeContentEditor";
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
  theme?: string;
  rootItemStyle?: any;
  primaryItemStyle?: any;
  normalItemStyle?: any;
  editorRendererFn?: (diagramState,nodeKey)=>React.ReactNode;
};

const defaultEditorRendererFn = (diagramState,nodeKey)=> {
  return <DefaultNodeContentEditor diagramState={diagramState} nodeKey={nodeKey}/>
};

export const defaultDiagramConfig : DiagramConfig = {
  direction: DiagramLayoutDirection.LEFT_AND_RIGHT,
  hMargin: 10,
  vMargin: 10,
  theme: "theme-orange",
  rootItemStyle: {
    fontSize: "24px",
    borderRadius: "10px",
    padding: "10px 25px"
  },
  primaryItemStyle: {
    fontSize: "16px",
    borderRadius: "6px",
    padding: "6px 15px"
  },
  editorRendererFn: defaultEditorRendererFn
};
