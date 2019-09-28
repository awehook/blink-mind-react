import * as React from "react";
import * as cx from "classnames";
import { DiagramState } from "../model/DiagramState";
import { NodeKeyType } from "../types/Node";
import RichMarkDownEditor from "awehook-rich-markdown-editor";
import { OpType } from "../model/MindMapModelModifier";
import { debounce } from "lodash";
import { OpFunction } from "../types/FunctionType";
import styled from "styled-components";
import debug from "debug";
const log = debug("node:content-editor");

const NodeContent = styled.div`
  padding: 6px 6px;
  //@ts-ignore
  background-color: ${props => (props.readOnly ? null : "#e0e0e0")};
  //@ts-ignore
  cursor: ${props => (props.readOnly ? "pointer" : "text")};
`;

interface DefaultNodeContentEditorProps {
  diagramState: DiagramState;
  op: OpFunction;
  nodeKey: NodeKeyType;
  saveRef?: Function;
}

interface DefaultNodeContentEditorState {}

export class DefaultNodeContentEditor extends React.Component<
  DefaultNodeContentEditorProps,
  DefaultNodeContentEditorState
> {
  constructor(props) {
    super(props);
  }

  onChange = (value: () => string) => {
    const { op, nodeKey } = this.props;
    op(OpType.SET_ITEM_CONTENT, nodeKey, value);
  };

  onMouseDown = e => {
    // log('node editor mousedown');
    e.stopPropagation();
  };

  onMouseMove = e => {
    // log('node editor mousemove');
    e.stopPropagation();
  };

  shouldComponentUpdate(
    nextProps: Readonly<DefaultNodeContentEditorProps>,
    nextState: Readonly<DefaultNodeContentEditorState>,
    nextContext: any
  ): boolean {
    let { nodeKey: nextNodeKey, diagramState: nextDS } = nextProps;
    let { nodeKey: nodeKey, diagramState: ds } = this.props;
    if (nextNodeKey !== nodeKey) {
      log("nextNodeKey !== nodeKey");
      return true;
    }
    let editingKey = ds.mindMapModel.getEditingContentItemKey();
    let nextEditingKey = nextDS.mindMapModel.getEditingContentItemKey();

    if (
      editingKey !== nextEditingKey &&
      (editingKey === nodeKey || nextEditingKey === nodeKey)
    )
      return true;

    if (
      ds.mindMapModel.getItem(nodeKey) !==
      nextDS.mindMapModel.getItem(nextNodeKey)
    ) {
      log(
        "ds.mindMapModel.getItem(nodeKey) !== nextDS.mindMapModel.getItem(nextNodeKey)"
      );
      return true;
    }
    return false;
  }

  render(): React.ReactNode {
    log("render");
    const { nodeKey, diagramState, saveRef } = this.props;
    const { mindMapModel } = diagramState;
    const nodeModel = mindMapModel.getItem(nodeKey);
    const content = nodeModel.getContent();
    const editingItemKey = mindMapModel.getEditingContentItemKey();

    log("getEditingItemKey", editingItemKey);
    const readOnly = !(nodeKey === editingItemKey);
    return (
      <NodeContent
        //@ts-ignore
        readOnly={readOnly}
        ref={saveRef(`editor-${nodeKey}`)}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
      >
        <RichMarkDownEditor
          // id={nodeKey}
          editorValue={content}
          onChange={debounce(this.onChange)}
          readOnly={readOnly}
        />
      </NodeContent>
    );
  }
}
