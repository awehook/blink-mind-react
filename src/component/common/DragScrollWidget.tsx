import * as React from "react";
import { BaseWidget } from "./BaseWidget";
import ResizeObserver from "resize-observer-polyfill";
import "./DragScrollWidget.scss";
import { bool } from "prop-types";

interface DragScrollWidgetProps {
  mouseKey?: "left" | "right";
  needKeyPressed?: boolean;
  canDragFunc? : ()=> Boolean
  children: (
    setViewBoxScroll: (left: number, top: number) => void,
    setViewBoxScrollDelta: (left: number, top: number) => void
  ) => React.ReactNode;
}

export class DragScrollWidget extends BaseWidget<DragScrollWidgetProps> {
  constructor(props: DragScrollWidgetProps) {
    super(props);
    this.state = {
      widgetStyle: {
        width: "10000px",
        height: "10000px"
      }
    };
  }

  static defaultProps = {
    mouseKey: "left",
    needKeyPressed: false
  };

  contentResizeCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
  ) => {
    // console.error("contentResizeCallback");
    // console.log(`${this.viewBox.scrollLeft} ${this.viewBox.scrollTop}`);
    if (this.oldContentRect) {
      let widgetStyle = {
        width: this.content.clientWidth + this.viewBox.clientWidth * 2,
        height: this.content.clientHeight + this.viewBox.clientHeight * 2
      };
      this.bigView.style.width = widgetStyle.width + "px";
      this.bigView.style.height = widgetStyle.height + "px";
    }
    this.oldContentRect = entries[0].contentRect;
  };

  contentResizeObserver = new ResizeObserver(this.contentResizeCallback);
  // oldScroll: { left: number; top: number };
  oldContentRect: DOMRectReadOnly;
  content: HTMLElement;
  contentRef = ref => {
    if (ref) {
      this.content = ref;
      this.contentResizeObserver.observe(this.content);
      this.setWidgetStyle();
    }
  };

  viewBox: HTMLElement;
  viewBoxRef = ref => {
    if (ref) {
      this.viewBox = ref;
      this.setWidgetStyle();
      this.setViewBoxScroll(
        this.viewBox.clientWidth,
        this.viewBox.clientHeight
      );
    }
  };

  bigView: HTMLElement;
  bigViewRef = ref => {
    if (ref) {
      this.bigView = ref;
      this.setWidgetStyle();
    }
  };

  setWidgetStyle = () => {
    if (this.content && this.viewBox && this.bigView) {
      this.bigView.style.width =
        (this.content.clientWidth + this.viewBox.clientWidth) * 2 + "px";
      this.bigView.style.height =
        (this.content.clientHeight + this.viewBox.clientHeight) * 2 + "px";

      this.content.style.left = this.viewBox.clientWidth + "px";
      this.content.style.top = this.viewBox.clientHeight + "px";
    }
  };

  setViewBoxScroll = (left: number, top: number) => {
    // console.error(`setViewBoxScroll`);
    if (this.viewBox) {
      this.viewBox.scrollLeft = left;
      this.viewBox.scrollTop = top;
    }
  };

  setViewBoxScrollDelta = (deltaLeft: number, deltaTop: number) => {
    // console.log(`setViewBoxScrollDelta ${deltaLeft} ${deltaTop}`);
    if (this.viewBox) {
      this.viewBox.scrollLeft += deltaLeft;
      this.viewBox.scrollTop += deltaTop;
    }
  };

  onMouseDown = e => {

    let { mouseKey, needKeyPressed,canDragFunc } = this.props;
    if(canDragFunc && !canDragFunc())
      return;
    if (
      (e.button === 0 && mouseKey === "left") ||
      (e.button === 2 && mouseKey === "right")
    ) {
      if (needKeyPressed) {
        if (!e.ctrlKey) return;
      }
      this._lastCoordX = this.viewBox.scrollLeft + e.nativeEvent.clientX;
      this._lastCoordY = this.viewBox.scrollTop + e.nativeEvent.clientY;
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);
    }
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

  handleContextMenu = e => {
    e.preventDefault();
  };

  componentDidMount(): void {
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  componentWillUnmount(): void {
    document.removeEventListener("contextmenu", this.handleContextMenu);
  }

  render() {
    return (
      <div
        ref={this.viewBoxRef}
        onMouseDown={this.onMouseDown}
        className="drag-scroll-view"
      >
        <div style={this.state.widgetStyle} ref={this.bigViewRef}>
          <div
            className="drag-scroll-content"
            ref={this.contentRef}
            style={this.state.contentStyle}
          >
            {this.props.children(
              this.setViewBoxScroll,
              this.setViewBoxScrollDelta
            )}
          </div>
        </div>
      </div>
    );
  }
}
