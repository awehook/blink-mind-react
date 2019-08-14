import * as React from "react";
import { DragScrollWidget } from "../../src/component/common/DragScrollWidget";

export default class Demo3 extends React.Component {
  contentRef = ref => {
    if (ref) {
      this.content = ref;
    }
  };
  content: HTMLElement;

  onClickBigger = () => {
    console.log(this.content.style.width);
    console.log(this.content.style.height);
    this.content.style.width = parseInt(this.content.style.width) + 50 + "px";
    this.content.style.height = parseInt(this.content.style.height) + 50 + "px";
    this.setState({});
  };
  render() {
    return (
      <DragScrollWidget>
        {() => (
          <div
            style={{ width: 100, height: 100, backgroundColor: "yellow" }}
            ref={this.contentRef}
          >
            <button onClick={this.onClickBigger}>
              click to become bigger
            </button>
          </div>
        )}
      </DragScrollWidget>
    );
  }
}
