import * as React from 'react';
import { BaseModal } from './common/BaseModal';
import { DiagramState } from '../model/DiagramState';
import { OpFunction } from '../types/FunctionType';
import { FocusItemMode } from '../types/Node';
import { OpType } from '../model/MindMapModelModifier';
import styled from 'styled-components';

interface ModalsProps {
  diagramState: DiagramState;
  op: OpFunction;
  saveRef?: Function;
}
interface ModalsState {}
const DescWrapper = styled.div`
  border: 1px solid #d9d9d9;
  height: calc(100% - 50px);
  padding: 0 1rem;
  overflow: auto;
  margin: 0.5rem 0.5rem 0 0.5rem;
`;
const EditDescModal = ({ diagramState, op, nodeKey, saveRef }) => {
  return (
    <React.Fragment>
      <DescWrapper>
        {diagramState
          .getConfig()
          .descEditorRenderFn(diagramState, op, nodeKey, saveRef)}
      </DescWrapper>
    </React.Fragment>
  );
};

export class Modals extends React.Component<ModalsProps, ModalsState> {
  handleClose = () => {
    this.props.op(OpType.END_EDITING);
  };

  getActiveModalName = () => {
    const focusItemMode = this.props.diagramState.getModel().getFocusItemMode();
    if (focusItemMode === FocusItemMode.EditingDesc) return 'edit-desc';
    return null;
  };

  render() {
    const { diagramState, op, saveRef } = this.props;
    const mindMapModel = diagramState.getModel();
    const activeModalName = this.getActiveModalName();
    const Modal = ({ name, children, ...rest }) => {
      return (
        <BaseModal
          isOpen={activeModalName === name}
          onRequestClose={this.handleClose}
          {...rest}
        >
          {React.cloneElement(children)}
        </BaseModal>
      );
    };

    return (
      <span>
        <Modal name="edit-desc" title="Edit Notes">
          <EditDescModal
            diagramState={diagramState}
            op={op}
            nodeKey={mindMapModel.getEditingDescItemKey()}
            saveRef={saveRef}
          />
        </Modal>
      </span>
    );
  }
}
