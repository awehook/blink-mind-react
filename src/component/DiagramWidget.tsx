import * as React from 'react';
import * as cx from 'classnames';
import { MindDragScrollWidget } from './MindDragScrollWidget';
import { BaseWidget } from './common/BaseWidget';
import { Modals } from './Modals';
import SaveRef from './common/SaveRef';
import { DiagramState } from '../model/DiagramState';
import { OnChangeFunction } from '../types/FunctionType';
import { OpType } from '../model/MindMapModelModifier';
import { NodeKeyType } from '../types/Node';
import Theme from './Theme';
import styled from 'styled-components';
import './DiagramWidget.css';

const Diagram = styled.div`
  width: 100%;
  height: 100%;
`;

export interface MindDiagramWidgetProps {
  diagramState: DiagramState;
  onChange: OnChangeFunction;
}

export class DiagramWidget<P extends MindDiagramWidgetProps> extends BaseWidget<
  MindDiagramWidgetProps
> {
  constructor(props: MindDiagramWidgetProps) {
    super(props);
  }

  //参数分为两种情况，array 表示批量执行多个操作
  op = (...args: any[]) => {
    if (args.length === 0) return;
    const { diagramState, onChange } = this.props;
    let newState;
    if (Array.isArray(args[0])) {
      const arr = args[0];
      newState = diagramState;
      arr.forEach(operation => {
        const { opType, nodeKey, arg } = operation;
        newState = DiagramState.op(newState, opType, nodeKey, arg);
      });
    } else {
      let opType, nodeKey, arg;
      opType = args[0];
      if (args.length >= 2) {
        nodeKey = args[1];
      }
      if (args.length >= 3) {
        arg = args[2];
      }
      newState = DiagramState.op(diagramState, opType, nodeKey, arg);
    }
    onChange(newState);
  };

  // onKeyUp = e => {
  //   log('DiagramWidget keyup');
  //   switch (e.which) {
  //     case Keys.TAB:
  //       this.op(OpType.ADD_CHILD);
  //       break;
  //     case Keys.RETURN:
  //       if(e.ctrlKey)
  //         this.op(OpType.ADD_SIBLING);
  //       break;
  //   }
  // };

  render() {
    const { diagramState } = this.props;
    const theme = diagramState.getThemeConfig();
    return (
      <SaveRef>
        {(saveRef, getRef) => (
          <Theme theme={theme}>
            <Diagram
              className={cx({
                [`${diagramState.getConfig().theme}`]: true
              })}
              // onKeyUp={this.onKeyUp}
            >
              {/*<Toolbar getRef={getRef}/>*/}
              <MindDragScrollWidget
                diagramState={diagramState}
                op={this.op}
                saveRef={saveRef}
                getRef={getRef}
              />
              <Modals diagramState={diagramState} op={this.op} />
            </Diagram>
          </Theme>
        )}
      </SaveRef>
    );
  }
}
