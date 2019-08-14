import * as React from "react";
import * as cx from "classnames";
import "./demo.scss";

interface DemoProps {}

interface DemoState {
  // 是否Drag进入Dst 区域
  dragEnterDst: boolean;
}

export default class Demo1 extends React.Component<DemoProps, DemoState> {
  constructor(props) {
    super(props);

    this.state = {
      dragEnterDst: false
    };
  }

  onDragEnter = e => {
    this.setState({
      dragEnterDst: true
    });
  };

  onDragLeave = e => {
    this.setState({
      dragEnterDst: false
    });
  };

  render() {
    return (
      <div>
        <div className="src" draggable></div>

        <div
          className={cx("dst", {
            "drag-enter": this.state.dragEnterDst
          })}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        ></div>
      </div>
    );
  }
}
