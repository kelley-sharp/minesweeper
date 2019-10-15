import React, { Component } from "react";
import Square from "./Square";
import "./Board.css";
import { cloneDeep } from "lodash";
import happySmiley from "../images/happy-smile.png";
import deadSmiley from "../images/dead-smile.png";
import coolSmiley from "../images/cool-smile.png";
import { Difficulty, Cell, Grid } from "./types";

type BoardProps = { difficulty: Difficulty };

type BoardState = {
  started: boolean;
  gameOver: boolean;
  currentTime: number;
  flagsRemaining: number;
  smiley: string;
  revealedCellCount: number;
  grid: Grid;
};

class Board extends Component<BoardProps, BoardState> {
  timerId?: number;

  constructor(props: BoardProps) {
    super(props);
    this.state = {
      grid: [[]],
      started: false,
      gameOver: false,
      currentTime: 0,
      flagsRemaining: 0,
      smiley: happySmiley,
      revealedCellCount: 0
    };
    this.timerId = undefined;
  }

  componentDidMount() {
    this.generateGrid();
  }

  componentWillUnmount() {
    // cleanup your timer
    window.clearInterval(this.timerId);
  }

  generateGrid() {
    // get rows, columns, and bombs from props, passed through Game
    let { rows, columns, bombs } = this.props.difficulty;

    //get an array with rows, map each row as an array with the length of number of columns
    const newGrid = Array.from({ length: rows }).map((row, rowIdx) =>
      //from each column in the array return an object with a val, coordinates, etc.
      Array.from({ length: columns }).map((col, colIdx) => {
        // this is where every single cell gets generated
        // abiogenesis
        return {
          value: 0,
          id: `${rowIdx},${colIdx}`, // id: 0,0
          isFlagged: false,
          playerRevealed: false,
          endRevealed: false
        };
      })
    );
    //re-render with state having the grid, and add number of bombs.
    this.setState({ grid: newGrid, flagsRemaining: bombs });
  }

  traverseAndReveal = (rowIdx: number, colIdx: number): void => {
    let revealedCellCount = this.state.revealedCellCount;
    // dfs to reveal each adjacent cell, stop at cells that have value of null or bomb.

    //make a deep clone of grid from state so that we can mutate a grid w/o affecting state directly
    const grid = cloneDeep(this.state.grid);

    //define cell to start with
    const firstCell = grid[rowIdx][colIdx];

    //define an stack to go through cells with
    const cellsToVisitStack = [firstCell];

    //define Set to keep track of cell id's seen before
    const cellIDsSeenBefore = new Set([firstCell.id]);

    let flagsRemaining = this.state.flagsRemaining;
    const { bombs, rows, columns } = this.props.difficulty;
    const numOfCells = rows * columns;

    //loop through stack until there are no other cells to visit.
    while (cellsToVisitStack.length > 0) {
      // get a current cell off the stack
      const currentCell = cellsToVisitStack.pop();
      if (currentCell) {
        // visit it
        if (currentCell.playerRevealed === false) {
          currentCell.playerRevealed = true;
          if (currentCell.isFlagged) {
            currentCell.isFlagged = false;
            flagsRemaining--;
          }
          revealedCellCount += 1;
        }

        if (revealedCellCount === numOfCells - bombs) {
          this.setState({ grid }, this.handleWin);
          return;
        }
        // add its neighbors to stack
        let neighbors = Array.from(
          this.getAdjacentCellCoordinatesSet(
            +currentCell.id.split(",")[0], // rowIdx
            +currentCell.id.split(",")[1], // colIdx,
            grid
          )
        );
        if (currentCell.value === 0) {
          neighbors.forEach(neighborCoords => {
            // get row idx and col idx from the string of neighbor's coordinates
            const [row, col] = neighborCoords.split(",");
            // actual neighbor cell in grid
            const neighborCell = grid[+row][+col];

            // check if we've seen it before
            if (!cellIDsSeenBefore.has(neighborCell.id)) {
              // mark it as seen
              cellIDsSeenBefore.add(neighborCell.id);
              // stack it up
              cellsToVisitStack.push(neighborCell);
            }
          });
        }
      }
    }

    this.setState({
      grid,
      flagsRemaining,
      revealedCellCount
    });
  };

  handleClick = (rowIdx: number, colIdx: number) => {
    //if the cell clicked is already revealed, do nothing
    if (this.state.grid[rowIdx][colIdx].playerRevealed) {
      return;
    }

    // handle first click
    if (!this.state.started) {
      this.setState({ started: true }, () => {
        // place bombs
        this.placeBombs(rowIdx, colIdx);
        // start timer
        this.timerId = window.setInterval(() => {
          this.setState(currentState => {
            return { currentTime: currentState.currentTime + 1 };
          });
        }, 1000);
      });
    } else {
      //if clicked cell is a bomb, set state game over to be true, call handleGameOver
      if (this.state.grid[rowIdx][colIdx].value === "bomb") {
        this.setState({ gameOver: true }, () => {
          this.handleGameOver();
        });
      } else {
        // handle every subsequent click
        this.traverseAndReveal(rowIdx, colIdx);
      }
    }
  };

  getAdjacentCellCoordinatesSet = (
    rowIdx: number,
    colIdx: number,
    grid: Grid
  ): Set<string> => {
    const adjacentCoordinatesSet = new Set();
    // add coordinates in all directions to a set
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
      for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
        let rowPosition = rowIdx + deltaRow;
        let colPosition = colIdx + deltaCol;
        // format: "row,col"
        // example: "5,4"
        //if cell is out of bounds of grid, continue
        if (
          rowPosition < 0 ||
          rowPosition >= grid.length || // max rows
          colPosition < 0 ||
          colPosition >= grid[0].length // max columns
        ) {
          continue;
        } else {
          //add string (e.g. '5,4') to adjacent coordinates
          adjacentCoordinatesSet.add(`${rowPosition},${colPosition}`);
        }
      }
    }

    return adjacentCoordinatesSet as Set<string>;
  };

  placeBombs(initialRowIdx: number, initialColIdx: number) {
    const { bombs, rows, columns } = this.props.difficulty;
    let bombCount = bombs;

    function _randInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    // make a deep copy of the grid
    const gridCopy = cloneDeep(this.state.grid);

    const adjacentCoordinatesSet = this.getAdjacentCellCoordinatesSet(
      initialRowIdx,
      initialColIdx,
      gridCopy
    );

    while (bombCount > 0) {
      let randomRow = _randInt(0, rows);
      let randomCol = _randInt(0, columns);
      // if the randomRow,randomCol are adjacent to the original click
      // then skip over them (we can't place a bomb here)
      const coordinatesAsString = `${randomRow},${randomCol}`;
      if (adjacentCoordinatesSet.has(coordinatesAsString)) {
        continue;
      }
      let bombPosition = gridCopy[randomRow][randomCol];
      if (bombPosition.value === "bomb") {
        continue;
      } else {
        bombPosition.value = "bomb";
        this.incrementSurroundingValues(randomRow, randomCol, gridCopy);
        bombCount--;
      }
    }

    //set grid(now with bombs) to state and now we can traversAndReveal
    this.setState({ grid: gridCopy }, () => {
      this.traverseAndReveal(initialRowIdx, initialColIdx);
    });
  }

  /**
   * Taking the position of the bomb on the grid,
   *  increment every non-bomb cell's value surrouding the bomb
   * @param {Number} rowIdx row index of the bomb
   * @param {Number} colIdx column index of the bomb
   * @param {Array<Array>} grid a reference to the current grid
   */
  incrementSurroundingValues(rowIdx: number, colIdx: number, grid: Grid) {
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
      for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
        // if this is the original row/col skip it
        if (deltaRow === 0 && deltaCol === 0) {
          continue;
        }

        let rowPosition = rowIdx + deltaRow;
        let colPosition = colIdx + deltaCol;

        if (
          rowPosition < 0 ||
          rowPosition >= grid.length || // max rows
          colPosition < 0 ||
          colPosition >= grid[0].length // max columns
        ) {
          continue;
        } else {
          if (grid[rowPosition][colPosition].value !== "bomb") {
            (grid[rowPosition][colPosition].value as number)++;
          }
        }
      }
    }
  }

  toggleFlag = (id: string) => {
    let flagsRemaining = this.state.flagsRemaining;
    const newGrid = this.state.grid.map(row =>
      row.map(cell => {
        if (cell.id === id) {
          if (!cell.playerRevealed) {
            if (cell.isFlagged) {
              flagsRemaining++;
            } else {
              flagsRemaining--;
            }
            return { ...cell, isFlagged: !cell.isFlagged };
          } else {
            return cell;
          }
        } else {
          return cell;
        }
      })
    );

    this.setState(currentState => {
      return { grid: newGrid, flagsRemaining };
    });
  };

  handleGameOver = () => {
    this.revealEntireBoard();

    window.clearInterval(this.timerId);

    this.setState(currentState => ({
      smiley: deadSmiley
    }));
  };

  revealEntireBoard = () => {
    const grid = cloneDeep(this.state.grid);
    grid.forEach(row => {
      row.forEach(cell => {
        cell.endRevealed = true;
      });
    });

    // const time = this.state.currentTime;

    // cleanup your timer
    window.clearInterval(this.timerId);

    this.setState({ grid });
  };

  handleWin = () => {
    this.setState({ smiley: coolSmiley });
    window.clearInterval(this.timerId);
    alert("you won!");
  };

  handleButtonClick = () => {
    window.clearInterval(this.timerId);

    this.setState(
      {
        grid: [[]],
        started: false,
        gameOver: false,
        currentTime: 0,
        flagsRemaining: 0,
        revealedCellCount: 0,
        smiley: happySmiley
      },
      this.generateGrid
    );
  };

  //render Board with Squares
  render() {
    return (
      <div className="inner-container">
        <div className="time-flags__container">
          <h2>time: {this.state.currentTime}</h2>
          <div className="button__container">
            <button onClick={this.handleButtonClick}>
              <img className="smiley" src={this.state.smiley} alt="reset" />
            </button>
          </div>
          <h2>flags: {this.state.flagsRemaining}</h2>
        </div>
        <div className="board">
          {this.state.grid.map((row, rowIdx) => {
            return (
              <div key={`row-${rowIdx}`} className="row">
                {row.map((cell, colIdx) => (
                  <Square
                    key={cell.id}
                    id={cell.id}
                    value={cell.value}
                    isFlagged={cell.isFlagged}
                    playerRevealed={cell.playerRevealed}
                    endRevealed={cell.endRevealed}
                    toggleFlag={this.toggleFlag}
                    handleClick={this.handleClick.bind(this, rowIdx, colIdx)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Board;
