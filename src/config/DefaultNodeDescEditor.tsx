import * as React from "react";
import * as cx from "classnames";
import { DiagramState } from "../model/DiagramState";
import { NodeKeyType } from "../types/Node";
import RichMarkDownEditor from "awehook-rich-markdown-editor";
import { OpType } from "../model/MindMapModelModifier";
import { debounce } from "lodash";
import "./DefaultNodeContentEditor.scss";
import { OpFunction } from "../types/FunctionType";
import styled from "styled-components";

const DescEditor = styled.div`
`;

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
    // console.log('node editor mousedown');
    e.stopPropagation();
  };

  onMouseMove = e => {
    // console.log('node editor mousemove');
    e.stopPropagation();
  };

  render(): React.ReactNode {
    const { nodeKey, diagramState } = this.props;
    const { mindMapModel } = diagramState;
    const nodeModel = mindMapModel.getItem(nodeKey);
    const desc = nodeModel.getDesc();

    // console.log(`edit item key ${mindMapModel.getEditingItemKey()}`);
    // console.log(`focus item key ${mindMapModel.getFocusItemKey()}`);
    // console.log(`node key ${nodeKey}`);

    console.log("DefaultNodeDescEditor render");
    console.log(
      `getEditingDescItemKey ${mindMapModel.getEditingDescItemKey()}`
    );
    console.log(desc);
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
