import * as React from "react";
import * as cx from "classnames";
import { MindDiagramModel } from "../model/MindDiagramModel";
import { MindDragScrollWidget } from "./MindDragScrollWidget";
import { BaseWidget } from "./common/BaseWidget";
import "./DiagramWidget.scss";
import SaveRef from "./common/SaveRef";
import { Toolbar } from "./Toolbar";

function log(obj) {
  console.log(obj);
}

export interface MindDiagramWidgetProps {
  diagramModel: MindDiagramModel;
}

export class DiagramWidget<
  P extends MindDiagramWidgetProps
> extends BaseWidget<MindDiagramWidgetProps> {
  constructor(props: MindDiagramWidgetProps) {
    super(props);
  }

  render() {
    return (
      <SaveRef>
        {(saveRef, getRef) => (
          <div
            className={cx("bm-diagram", {
              [`${this.props.diagramModel.config.theme}`]: true
            })}
          >
            <Toolbar getRef={getRef}/>
            <MindDragScrollWidget
              diagramModel={this.props.diagramModel}
              saveRef={saveRef}
              getRef={getRef}
            />
          </div>
        )}
      </SaveRef>
    );
  }
}
