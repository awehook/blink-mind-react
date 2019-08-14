import * as React from 'react';
import {DragDropDestWidget} from "../../src/component/common/DragDropDestWidget";
import './demo.scss';

export default class Demo60 extends React.Component {

  render() {
    return (
      <div>
        <div className='src' draggable>
        </div>
        <DragDropDestWidget>
          <div className='dst'></div>
        </DragDropDestWidget>
      </div>
    )
  }
}