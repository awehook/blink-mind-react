import * as React from "react";
import * as cx from "classnames";
import "./demo.scss";

interface DemoProps {}

interface DemoState {
  // 是否Drag进入Dst 区域
  dragEnterDst: boolean;
}

export default class Demo extends React.Component<DemoProps, DemoState> {
  constructor(props) {
    super(props);

    this.state = {
      dragEnterDst: false
    };
  }

  onDragEnter = e => {
    console.log("onDragEnter");
    this.setState({
      dragEnterDst: true
    });
  };

  onDragLeave = e => {
    console.log("onDragLeave");
    this.setState({
      dragEnterDst: false
    });
  };

  onDragStart = e => {};

  onDragEnd = e => {};

  onMouseDown = e => {
    console.log("onMouseDown");
    // return false;
  };

  onMouseUp = e => {
    console.log("onMouseUp");
  };

  render() {
    return (
      <div
        className="container"
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <div
          className="src"
          draggable
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        />

        <div
          className={cx("dst", {
            "drag-enter": this.state.dragEnterDst
          })}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          <div className="dst-sub none-pointer-events" />
        </div>
      </div>
    );
  }
}
