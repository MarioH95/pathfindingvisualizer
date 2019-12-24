import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './Pathfinder.css';
import { node } from 'prop-types';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;
let PREV_START_NODE_ROW = 10;
let PREV_START_NODE_COL = 15;
let PREV_FINISH_NODE_ROW = 10;
let PREV_FINISH_NODE_COL = 35;

export default class Pathfinder extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startHeld: false,
      finishHeld: false,
      startCol: START_NODE_COL,
      startRow: START_NODE_ROW,
      finishCol: FINISH_NODE_COL,
      finishRow: FINISH_NODE_ROW,
      pathFound: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  reset() {
    let newGrid = this.state.grid;
    for (let row of newGrid) {
      for (let node of row) {
        if (!node.isStart && !node.isFinish && !node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node';
        }  else if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish';
        }
        if (!node.isStart) {
          node.isVisited = false;
          node.distance = Infinity;
        }
      }
    }
    this.setState({grid: newGrid, pathFound: false});
  }

  resetEverything() {
    let newGrid = this.state.grid;
    for (let row of newGrid) {
      for (let node of row) {
        if (node.isWall && !node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node';
          node.isVisited = false;
          node.distance = Infinity;
          node.isWall = false;
        }
        if (!node.isStart && !node.isFinish && !node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node';
        }  else if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish';
        }
        if (!node.isStart) {
          node.isVisited = false;
          node.distance = Infinity;
        }
      }
    }
    this.setState({grid: newGrid, pathFound: false});
  }

  handleMouseDown(row, col, isStart, isFinish) {
    if(this.state.pathFound) return;
    this.setState({startHeld: isStart, finishHeld: isFinish})
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, isStart, isFinish, false);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseOver(row, col) {
    if (!this.state.mouseIsPressed || this.state.pathFound) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.startHeld, this.state.finishHeld);
    this.setState({grid: newGrid});

    if(this.state.startHeld){
        this.setState({startCol: col,startRow: row,})
    } else if (this.state.finishHeld){
        this.setState({finishCol: col, finishRow: row,})
    }

    if(this.state.startHeld) {
      this.setState({prevStartCol: col,
                    prevStartRow: row})
    } else if (this.state.finishHeld) {
      this.setState({prevFinishCol: col,
                    prevFinishRow: row});
    }
  }

  handleMouseUp(row, col) {
    this.setState({mouseIsPressed: false, startHeld: false, finishHeld:false})
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        let node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        let node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
      
    }
  }
  
  visualizeDijkstra() {
    this.setState({pathFound: true});
    let {grid} = this.state;
    let startNode = grid[this.state.startRow][this.state.startCol];
    let finishNode = grid[this.state.finishRow][this.state.finishCol];
    let visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    let nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    const node = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1];
    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
    
  }

  render() {
    let {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="headerContainer">
          <button className="headerButton" onClick={() => this.reset()}>
            Reset Path
          </button>
          <button className="headerButton" target="_blank" onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button className="headerButton" onClick={() => this.resetEverything()}>
            Reset Everything
          </button>
        </div>
            <div className="grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div className="rowContainer" key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      let {row, col, isVisited, isFinish, isStart, isWall} = node;
                      return (
                        <Node
                          key={nodeIdx}
                          col={col}
                          isVisited={isVisited}
                          isFinish={isFinish}
                          isStart={isStart}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col, isStart, isFinish) => this.handleMouseDown(row, col, isStart, isFinish)}
                          onMouseOver={(row, col) => this.handleMouseOver(row, col)}
                          onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                          row={row}></Node>
                      );
                    })}
                  </div>
                  
                );
              })}
            </div>
            <div className="informationWrapper">
              <div className="informationContainer">
                <div id="greenBox"></div>
                <p className="description">Start Node</p>
              </div>
              <div className="informationContainer">
                <div id="blueBox"></div>
                <p className="description">End Node</p>
              </div>
              <div className="informationContainer">
                <div id="grayBox"></div>
                <p className="description">Wall Node</p>
              </div>
            </div>
            <p className="instructions">Drag and drop start and end nodes to re-position. Hold left click on free spaces in order to create wall nodes.</p>
            
      </>
    );
  }
}
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col, startHeld, finishHeld) => {
  const newGrid = grid.slice();
  if (startHeld) {
    START_NODE_ROW = row;
    START_NODE_COL = col;
    const prevNodeGrid = newGrid[PREV_START_NODE_ROW][PREV_START_NODE_COL];
    const prevNode = {
      ...prevNodeGrid,
      isStart: false,
      distance: Infinity,
      isWall: false,
      previousNode: null,
    };
    newGrid[PREV_START_NODE_ROW][PREV_START_NODE_COL] = prevNode
    const newNodeGrid = newGrid[row][col];
    const newNode = {
      ...newNodeGrid,
      isStart: true,
      distance: 0,
      isWall: false,
      previousNode: null,
      };
    newGrid[row][col] = newNode;
    PREV_START_NODE_ROW = row;
    PREV_START_NODE_COL = col;
  } else if (finishHeld) {
    FINISH_NODE_ROW = row;
    FINISH_NODE_COL = col;
    const prevNodeGrid = newGrid[PREV_FINISH_NODE_ROW][PREV_FINISH_NODE_COL];
    const prevNode = {
      ...prevNodeGrid,
      isFinish: false,
      distance: Infinity,
      isWall: false,
      previousNode: null,
    };
    newGrid[PREV_FINISH_NODE_ROW][PREV_FINISH_NODE_COL] = prevNode
    const newNodeGrid = newGrid[row][col];
    const newNode = {
      ...newNodeGrid,
      isFinish: true,
      isWall: false,
      previousNode: null,
      };
    newGrid[row][col] = newNode;
    PREV_FINISH_NODE_ROW = row;
    PREV_FINISH_NODE_COL = col;
  } else {
    const node = newGrid[row][col];
    const newNode = {
    ...node,
    isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
  }

  return newGrid;

};