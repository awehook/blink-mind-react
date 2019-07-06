import * as React from "react";
import "./demo.scss";

export default class Demo extends React.Component {
  viewBoxRef = ref => {
    if (ref) {
      this.viewBox = ref;
      this.viewBox.scrollLeft = 1500;
      this.viewBox.scrollTop = 1000;
    }
  };
  viewBox: HTMLElement;

  onMouseDown = e => {
    this._lastCoordX = this.viewBox.scrollLeft + e.nativeEvent.clientX;
    this._lastCoordY = this.viewBox.scrollTop + e.nativeEvent.clientY;
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  };

  onMouseUp = e => {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  };

  _lastCoordX: number;
  _lastCoordY: number;

  onMouseMove = (e: MouseEvent) => {
    this.viewBox.scrollLeft = this._lastCoordX - e.clientX;
    this.viewBox.scrollTop = this._lastCoordY - e.clientY;
  };

  render() {
    return (
      <div className="view-box" ref={this.viewBoxRef}>
        <div className="container" onMouseDown={this.onMouseDown}>
          <div className="content"/>
        </div>
      </div>
    );
  }
}
