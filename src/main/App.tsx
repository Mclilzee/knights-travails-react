import { useState } from "react";
import ChessBoard from "./chess/ChessBoard"
import { ChessData } from "./chess/interfaces";
import PathFinder from "./utils/search/PathFinder";
import TupleSet from "./utils/TupleSet";

function App() {
  const [board, setBoard] = useState(() => createBoard());
  const [pathFinder] = useState(() => new PathFinder());

  function selectCell(id: string): void {
    setBoard((board) => {
      return board.map((cell) => {
        return { ...cell, selected: cell.id === id ? true : false };
      });
    });
  }

  function moveKnight(id: string): void {
    setBoard((board) => {
      return board.map((cell) => {
        return id === cell.id ? { ...cell, selected: false, knight: true } : { ...cell, knight: false };
      });
    });
  }

  function findShortestPath() {
    const start = findKnightPosition();
    const goal = findGoalDestination();

    if (goal == null) {
      return;
    }

    const path = pathFinder.findShortestPath(start, goal)
    updateBoard(path, true);
  }

  function visitAllCells() {
    const start = findKnightPosition();
    const path = pathFinder.visitAllSquares(start);
    updateBoard(path, false);
  }

  function findKnightPosition(): [number, number] {
    for (const cell of board) {
      if (cell.knight) {
        return cell.point;
      }
    }

    throw new Error("Could not find the knight position, which is impossible");
  }

  function findGoalDestination(): [number, number] | null {
    for (const cell of board) {
      if (cell.selected) {
        return cell.point;
      }
    }

    return null;
  }

  function updateBoard(path: [number, number][], selectedPersist: boolean) {
    const boardCopy: ChessData[] = board.map((cell) => {
      return { ...cell, selected: selectedPersist ? cell.selected : false, step: 0 }
    });

    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      for (const cell of boardCopy) {
        if (cell.point[0] === point[0] && cell.point[1] === point[1]) {
          cell.step = i;
          break;
        }
      }
    }

    setBoard(boardCopy);
  }

  return (
    <div className="root">
      <ChessBoard board={board} moveKnight={moveKnight} selectCell={selectCell} />
      <div className="controls-container">
        <button onClick={findShortestPath}>Find shortest path</button>
        <button onClick={visitAllCells}>Visit all cells</button>
      </div>
    </div>
  )
}

function createBoard(): ChessData[] {
  const cells: ChessData[] = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      cells.push({
        id: i + "" + j,
        point: [i, j],
        knight: i === 3 && j === 4 ? true : false,
        selected: false,
        step: 0
      })
    }
  }

  return cells;
}

export default App
