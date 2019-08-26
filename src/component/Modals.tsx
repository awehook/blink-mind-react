import * as React from "react";
import { BaseModal } from "./common/BaseModal";
import { DiagramState } from "../model/DiagramState";
import { OpFunction } from "../types/FunctionType";
import { FocusItemMode } from "../types/Node";
import { OpType } from "../model/MindMapModelModifier";
import styled from "styled-components";

interface ModalsProps {
  diagramState: DiagramState;
  op: OpFunction;
  saveRef?: Function;
}
interface ModalsState {}
const ModalTitle = styled.div`
  color: black;
  text-align: center;
`;
const DescWrapper = styled.div`
  padding: 2rem;
`;
const EditDescModal = ({ diagramState, op, nodeKey, saveRef }) => {
  return (
    <React.Fragment>
      <ModalTitle>Edit note</ModalTitle>
      <DescWrapper>
        {diagramState.config.descEditorRenderFn(diagramState, op, nodeKey, saveRef)}
      </DescWrapper>
    </React.Fragment>
  );
};

export class Modals extends React.Component<ModalsProps, ModalsState> {
  handleClose = () => {
    this.props.op(OpType.SET_FOCUS_ITEM_MODE, null, FocusItemMode.Normal);
  };

  getActiveModalName = () => {
    let focusItemMode = this.props.diagramState.mindMapModel.getFocusItemMode();
    if (focusItemMode === FocusItemMode.EditingDesc) return "edit-desc";
    return null;
  };

  render() {
    const { diagramState, op, saveRef } = this.props;
    const { mindMapModel, config } = diagramState;
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
        <Modal name="edit-desc" title="edit notes">
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
