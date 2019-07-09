import * as React from "react";
import * as cx from "classnames";
import { MindDiagramModel } from "../model/MindDiagramModel";
import { MindDragScrollWidget } from "./MindDragScrollWidget";
import { BaseWidget } from "./common/BaseWidget";
import "./MindDiagramWidget.scss";
import SaveRef from "./common/SaveRef";

function log(obj) {
  console.log(obj);
}

export interface MindDiagramWidgetProps {
  diagramModel: MindDiagramModel;
}

export class MindDiagramWidget<
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
