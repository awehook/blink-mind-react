import * as React from "react";
import * as ReactModal from "react-modal";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { Flex } from "./Flex";

ReactModal.setAppElement("#root");

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
          <Close onClick={onRequestClose} className='iconfont bm-close'>
          </Close>
          {children}
        </Content>
      </StyledModal>
    </React.Fragment>
  );
};
const StyledModal = styled(ReactModal)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  outline: none;
  background-color: black;
  opacity: 0.2;
`;

//@ts-ignore
const Content = styled(Flex)`
  width: 640px;
  height: 100%;
  background: white;
  opacity: 1;
  border: 2px solid black;
  max-width: 100%;
  position: relative;
`;

const Esc = styled.span`
  display: block;
  text-align: center;
  margin-top: -10px;
  font-size: 13px;
`;

const Close = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  color: black;

  &:hover {
    opacity: 1;
  }

  // ${breakpoint("tablet")`
  //   top: 1rem;
  //   right: 1rem;
  // `};
`;
