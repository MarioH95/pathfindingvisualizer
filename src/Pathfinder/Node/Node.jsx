import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      isVisited,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseOver,
      onMouseLeave,
      onMouseUp,
      row,
      pathFound
    } = this.props;
    const extraClassName = 
      isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col, isStart, isFinish)}
        onMouseOver={() => onMouseOver(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}