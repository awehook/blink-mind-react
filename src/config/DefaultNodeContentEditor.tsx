import * as React from "react";

import { MindDiagramState } from "../component/MindDiagramState";
import { NodeKeyType } from "../model/NodeModel";
import RichMarkDownEditor from "awehook-rich-markdown-editor";
import { OpType } from "../model/MindMapModelModifier";
import { debounce } from "lodash";
import './DefaultNodeContentEditor.scss';

interface DefaultNodeContentEditorProps {
  diagramState: MindDiagramState;
  nodeKey: NodeKeyType;
}

interface DefaultNodeContentEditorState {
  editMode: boolean;
}

export class DefaultNodeContentEditor extends React.Component<
  DefaultNodeContentEditorProps,
  DefaultNodeContentEditorState
> {
  constructor(props) {
    super(props);
    this.state = {
      editMode: true
    };
  }

  onChange = (value: () => string) => {
    const { nodeKey, diagramState } = this.props;
    diagramState.op(OpType.SET_ITEM_CONTENT, nodeKey, value);
  };

  onMouseMove = (e)=> {
    e.stopPropagation();
  };

  shouldComponentUpdate(nextProps: Readonly<DefaultNodeContentEditorProps>, nextState: Readonly<DefaultNodeContentEditorState>, nextContext: any): boolean {
    if(nextProps.nodeKey!== this.props.nodeKey)
      return true;
    let {nodeKey} = nextProps;
    if(nextProps.diagramState.mindMapModel.getItem(nodeKey).getContent()!==this.props.diagramState.mindMapModel.getItem(nodeKey).getContent())
      return true;
    return false;
  }

  render(): React.ReactNode {
    const { nodeKey, diagramState } = this.props;
    const { mindMapModel } = diagramState;
    const nodeModel = mindMapModel.getItem(nodeKey);
    const content = nodeModel.getContent();
    return (
      <div onMouseMove={this.onMouseMove} className='bm-node-content'>
        <RichMarkDownEditor
          // id={nodeKey}
          editorValue={content}
          onChange={debounce(this.onChange)}
          readOnly={!this.state.editMode}
        />
      </div>
    );
  }
}
