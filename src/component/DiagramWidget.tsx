import * as React from "react";
import * as cx from "classnames";
import { MindDragScrollWidget } from "./MindDragScrollWidget";
import { BaseWidget } from "./common/BaseWidget";
import "./DiagramWidget.scss";
import SaveRef from "./common/SaveRef";
import { DiagramState } from "../model/DiagramState";
import { OnChangeFunction } from "../types/FunctionType";
import { OpType } from "../model/MindMapModelModifier";
import { NodeKeyType } from "../types/Node";

function log(obj) {
  console.log(obj);
}

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

  op = (opType: OpType, nodeKey: NodeKeyType, arg?) => {
    let { diagramState, onChange } = this.props;
    let newState = DiagramState.op(diagramState, opType, nodeKey, arg);
    onChange(newState);
  };

  render() {
    return (
      <SaveRef>
        {(saveRef, getRef) => (
          <div
            className={cx("bm-diagram", {
              [`${this.props.diagramState.config.theme}`]: true
            })}
          >
            {/*<Toolbar getRef={getRef}/>*/}
            <MindDragScrollWidget
              diagramState={this.props.diagramState}
              op={this.op}
              saveRef={saveRef}
              getRef={getRef}
            />
          </div>
        )}
      </SaveRef>
    );
  }
}
