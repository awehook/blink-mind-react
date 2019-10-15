import * as React from 'react';
import styled from 'styled-components';

type JustifyValues =
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'flex-start'
  | 'flex-end';

type AlignValues =
  | 'stretch'
  | 'center'
  | 'baseline'
  | 'flex-start'
  | 'flex-end';

type Props = {
  column?: boolean;
  shrink?: boolean;
  align?: AlignValues;
  justify?: JustifyValues;
  auto?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const Flex = (props: Props) => {
  const { children, ...restProps } = props;
  return <Container {...restProps}>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  //@ts-ignore
  flex: ${({ auto }) => (auto ? '1 1 auto' : 'initial')};
  //@ts-ignore
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
  //@ts-ignore
  align-items: ${({ align }) => align};
  //@ts-ignore
  justify-content: ${({ justify }) => justify};
  //@ts-ignore
  flex-shrink: ${({ shrink }) => (shrink ? 1 : 'initial')};
  min-height: 0;
  min-width: 0;
`;
