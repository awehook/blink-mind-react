import * as React from "react";
import * as cx from "classnames";
import "./demo.scss";
import "./demo8.scss";

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
    console.log(e.nativeEvent.target);
    this.setState({
      dragEnterDst: true
    });
  };

  onDragLeave = e => {
    console.log("onDragLeave");
    let target = e.nativeEvent.target;
    let relatedTarget = e.nativeEvent.relatedTarget;
    // console.log(this.dst);
    console.log(target);
    console.log(relatedTarget);
    if (this.dst == relatedTarget || this.dst.contains(relatedTarget)) {
      return;
    }
    console.log("onDragLeave: set state false");
    this.setState({
      dragEnterDst: false
    });
  };

  onDragOver = e => {
    e.preventDefault();
  };

  onDrop = e => {
    console.log("onDrop");
  };

  dst;
  dstRef = ref => {
    this.dst = ref;
  };

  render() {
    return (
      <div>
        <div className="src" draggable></div>

        <div
          className={cx(
            "dst",
            { dstc: true },
            {
              "drag-enter": this.state.dragEnterDst
            }
          )}
          onDragOver={this.onDragOver}
          // onDragEnter={this.onDragEnter}
          // onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          ref={this.dstRef}
        >
          {/*<div className='dst-sub'>*/}
          {/*<div className='dst-sub-sub'/>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}
