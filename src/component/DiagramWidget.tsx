import * as React from "react";
import * as cx from "classnames";
import * as Keys from "fbjs/lib/Keys";
import { MindDragScrollWidget } from "./MindDragScrollWidget";
import { BaseWidget } from "./common/BaseWidget";
import { Modals } from "./Modals";
import SaveRef from "./common/SaveRef";
import { DiagramState } from "../model/DiagramState";
import { OnChangeFunction } from "../types/FunctionType";
import { OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../types/Node";
import Theme from "./Theme";
import styled from "styled-components";
import "./DiagramWidget.css";

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

  op = (opType: OpType, nodeKey?: NodeKeyType, arg?) => {
    let { diagramState, onChange } = this.props;
    let newState = DiagramState.op(diagramState, opType, nodeKey, arg);
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
    let { diagramState } = this.props;
    let theme = diagramState.getThemeConfig();
    let editingDescKey = diagramState.mindMapModel.getEditingDescItemKey();
    return (
      <SaveRef>
        {(saveRef, getRef) => (
          <Theme theme={theme}>
            <Diagram
              className={cx({
                [`${diagramState.config.theme}`]: true
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
