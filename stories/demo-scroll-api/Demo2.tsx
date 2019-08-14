import * as React from "react";
import { DragScrollWidget } from "../../src/component/common/DragScrollWidget";

export default class Demo2 extends React.Component {
  render() {
    return (
      <DragScrollWidget>
        {() => (
          <div style={{ width: 100, height: 100, backgroundColor: "yellow" }} />
        )}
      </DragScrollWidget>
    );
  }
}
