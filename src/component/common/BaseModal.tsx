import * as React from "react";
import * as ReactModal from "react-modal";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { Flex } from "./Flex";

ReactModal.setAppElement("#root");

const StyledModal = styled(ReactModal)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  outline: none;
  background-color: rgba(0, 0, 0, 0.2);
`;

//@ts-ignore
const Content = styled(Flex)`
  width: 640px;
  height: 90%;
  background: white;
  border: 1px solid #d9d9d9;
  max-width: 100%;
  position: relative;
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e4e4e4;
  background: #5b637a;
 
  height: 30px;
`;

const Close = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 5px;
  &:hover {
    color: black;
    background: #d7d7d7;
  }
  

  // ${breakpoint("tablet")`
  //   top: 1rem;
  //   right: 1rem;
  // `};
`;

type Props = {
  children?: React.ReactNode;
  isOpen: boolean;
  title?: string;
  onRequestClose: () => any;
};

export const BaseModal = ({
  children,
  isOpen,
  title = "Untitled",
  onRequestClose,
  ...rest
}: Props) => {
  if (!isOpen) return null;

  return (
    <React.Fragment>
      <StyledModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel={title}
      >
        <Content column>
          <ModalTitle>
            <div/>
            <span>{title}</span>
            <Close onClick={onRequestClose}>
              <div className="iconfont bm-close" />
            </Close>
          </ModalTitle>

          {children}
        </Content>
      </StyledModal>
    </React.Fragment>
  );
};

