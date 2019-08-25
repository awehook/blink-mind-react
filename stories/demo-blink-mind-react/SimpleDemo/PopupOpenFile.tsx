import * as React from 'react';
import {Popup} from "./Popup";

interface PopupOpenFileProps {

}

class PopupOpenFile extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickOpenFile = ()=> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.bm';

    const fr = new FileReader();
    fr.onload = ev => {
      const text = ev.target.result;

    }
  };

  render() {
    return (
      <Popup>
        <button onClick={this.onClickOpenFile}>打开文件</button>
      </Popup>
    )
  }
}
