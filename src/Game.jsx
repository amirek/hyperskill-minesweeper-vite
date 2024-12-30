import React, {useState} from 'react';
import {Field} from "./Field.jsx";
import {ControlPanel} from "./ControlPanel.jsx";
import './App.css'

export const MainGame = (props) => {
  const cols = props.cols;
  const rows = props.rows;
  const bombs = Math.min(cols*rows - 1, props.bombs);

  const [gameOn, setGameOn] = useState(false);
  const [gameResult, setGameResult] = useState(0);
  const [gameReset, setGameReset] = useState(false);
  const [game, setGame] = useState(getNewGame(rows, cols, bombs, -1, -1));

  const countFlags = () => {
    let count = 0;
    for (let ri = 0; ri < game.length; ri++) {
      for (let ci = 0; ci < game[0].length; ci++) {
        if (game[ri][ci].isFlagged) count++;
      }
    }
    return bombs - count;
  }

  const preventDefault = (e) => {
    e.preventDefault();
  }

  const resetGame = () => {
    setGame(getNewGame(rows, cols, bombs));
    setGameOn(false);
    setGameResult(0);
    setGameReset(true);
  }

  const showBombs = (game) => {
    for(let i=0; i<rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (game[i][j].isBomb) {
          game[i][j].isOpen = true;
        }
      }
    }
  }

  const openManyCells = (game, row, column) => {
    if (row < 0 || column < 0 || row >= game.length || column >= game[0].length) {
      return ;
    }
    // console.log(`TRAVERSING CELL: [${row}][${column}]: isOpen: ${game[row][column].isOpen} count: ${game[row][column].count}`);

    if(!game[row][column].isOpen && !game[row][column].isBomb && !game[row][column].isFlagged){
      game[row][column].isOpen = true;
      if(game[row][column].count === 0) {
        openManyCells(game, row - 1, column);
        openManyCells(game, row, column - 1);
        openManyCells(game, row, column + 1);
        openManyCells(game, row + 1, column);
      }
    }
  }

  const checkGameResult = (game) => {
    for(let i=0; i<rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (game[i][j].isBomb) {
          if(game[i][j].isOpen){
            setGameResult(-1);  //lost
            setGameOn(false);
            return;
          }
          if(!game[i][j].isFlagged){
            return; //indecisive (yet)
          }
        }
        if (!game[i][j].isBomb && !game[i][j].isOpen) {
          return; //indecisive (yet)
        }
      }
    }
    setGameResult(1); //won
    setGameOn(false);
  }

  const openCell = (row, column) => {
    let gameCopy = [...game];
    let cell = gameCopy[row][column];
    if(cell.isOpen || cell.isFlagged || gameResult !== 0){
      return;
    }

    // let result = "empty";
    if(cell.isBomb && !gameOn){
      console.log("REBUILDING GAME");
      gameCopy = getNewGame(rows, cols, bombs, column, row)
      cell = gameCopy[row][column];
    }
    if(!gameOn){
      console.log("STARTING GAME");
      setGameOn(true);
      setGameReset(false);
    }
    if(cell.isBomb){
      console.log("LOST GAME");
      setGameOn(false);
      gameCopy[row][column].isOpen = true;
      showBombs(gameCopy);
      setGameResult(-1);
    } else{
      openManyCells(gameCopy, row, column);
      checkGameResult(gameCopy);
    }
    // console.log(`[${row}][${column}]: ${result}`);
    setGame(gameCopy);
    checkGameResult(gameCopy);
    // return result;
  }

  const flagCell = (row, column) => {
    if(gameOn){
      if(!game[row][column].isOpen) {
        if (countFlags() > 0 || game[row][column].isFlagged) {
          let gameCopy = [...game];
          gameCopy[row][column].isFlagged = !gameCopy[row][column].isFlagged;
          checkGameResult(gameCopy);
          setGame(gameCopy);
        }
      }else{
        console.log("can't mark an open field");
      }
    } else{
      console.log("can't mark before start");
    }
  }

  return (
    <div className="Game" onContextMenu={preventDefault}>
      <ControlPanel gameOn={gameOn} handleResetGame={resetGame} flagCount={countFlags()} gameResult={gameResult} gameReset={gameReset}/>
      <Field game={game} handleOpening={(ci, ri) => openCell(ci, ri)} handleFlagging={(ci, ri) => flagCell(ci, ri)}/>
    </div>
  );
}

const increaseBombCounts = (game, row, col) => {
  increaseBombCount(game,row-1, col-1);
  increaseBombCount(game,row-1, col);
  increaseBombCount(game,row-1, col+1);
  increaseBombCount(game,row, col-1);
  increaseBombCount(game,row, col+1);
  increaseBombCount(game,row+1, col-1);
  increaseBombCount(game,row+1, col);
  increaseBombCount(game,row+1, col+1);
}

const increaseBombCount = (game, row, col) => {
  if (row >= 0 && col >= 0 && row < game.length && col < game[0].length){
    game[row][col].count = parseInt(game[row][col].count) + 1;
    // console.log(`[${row}][${col}]`);
    // console.log(game[row][col]);
  }
}

const getNewGame = (rows, cols, bombs, excludedCellRow, excludedCellCol) => {
  const game = [];
  for(let i=0; i<rows; i++) {
    game[i] = [];
    for(let j=0; j<cols; j++) {
      game[i][j] = {
        isBomb: false,
        isFlagged: false,
        isOpen: false,
        count: 0
      };
    }
  }

  let placedBombs = 0;
  while (placedBombs < bombs) {
    let row = parseInt(Math.random() * rows);
    let col = parseInt(Math.random() * cols);
    if (game[row][col].isBomb === false && (row !== excludedCellRow || col !== excludedCellCol)) {
      game[row][col].isBomb = true;
      increaseBombCounts(game, row, col);
      placedBombs++;
    }
  }
  // console.log("PLACED BOMBS: " + placedBombs + " of " + bombs);

  return game;
}
