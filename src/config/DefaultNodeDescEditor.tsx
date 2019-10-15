import * as React from "react";
import { DiagramState } from "../model/DiagramState";
import { NodeKeyType } from "../types/Node";
import RichMarkDownEditor from "awehook-rich-markdown-editor";
import { OpType } from "../model/MindMapModelModifier";
import { debounce } from "lodash";
import { OpFunction } from "../types/FunctionType";
import styled from "styled-components";
import debug from "debug";
const log = debug("node:desc-editor");

const DescEditor = styled.div``;

interface DefaultNodeDescEditorProps {
  diagramState: DiagramState;
  op: OpFunction;
  nodeKey: NodeKeyType;
  saveRef?: Function;
}

interface DefaultNodeDescEditorState {}

export class DefaultNodeDescEditor extends React.PureComponent<
  DefaultNodeDescEditorProps,
  DefaultNodeDescEditorState
> {
  constructor(props) {
    super(props);
  }

  onChange = (value: () => string) => {
    const { op, nodeKey } = this.props;
    op(OpType.SET_ITEM_DESC, nodeKey, value);
  };

  onMouseDown = e => {
    e.stopPropagation();
  };

  onMouseMove = e => {
    e.stopPropagation();
  };

  render(): React.ReactNode {
    const { nodeKey, diagramState } = this.props;
    const mindMapModel  = diagramState.getMindMapModel();
    const nodeModel = mindMapModel.getItem(nodeKey);
    const desc = nodeModel.getDesc();
    log(
      "DefaultNodeDescEditor render",
      mindMapModel.getEditingDescItemKey(),
      desc
    );
    //"" && 3 = "" 由于空字符
    return (
      desc !== undefined &&
      desc !== null && (
        <DescEditor
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
        >
          <RichMarkDownEditor
            // id={nodeKey}
            editorValue={desc}
            onChange={debounce(this.onChange)}
          />
        </DescEditor>
      )
    );
  }
}
