import React, {useState, useEffect, useRef} from 'react';
import bombIcon from './assets/react.svg'

import './App.css'

export const ControlPanel = ({gameOn, handleResetGame, flagCount, gameReset, gameResult}) => {
  return (
    <div className="ControlPanel">
      <div className="Title">Minesweeper <img src={bombIcon} className="Cp-logo" alt="logo"/></div>
      <div className="Row">
        <Counter flagCount={flagCount}/>
        <Result gameResult={gameResult} handleResetGame={handleResetGame}/>
        <Timer gameOn={gameOn} gameReset={gameReset}/>
      </div>
    </div>
  );
}

const Counter = ({flagCount}) => {
  return (
    <div className="Column">💣 {flagCount}</div>
  )
}

const Result = ({gameResult, handleResetGame}) => {

  const renderGameResult = (gameResult) => {
    if(gameResult === 0){
      return "😐";
    }
    if(gameResult === -1){
      return "☹️";
    }
    if(gameResult === 1){
      return "😀";
    }
  }

  return (
    <div className="Column Reset" onClick={handleResetGame}>{renderGameResult(gameResult)}</div>
  )
}

function timeFormat(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')} ⏱️`;
}

const Timer = ({gameOn, gameReset}) => {
  const [time, setTime] = useState(0);
  let timerInterval;
  useEffect(() => {
    if (gameOn) {
      timerInterval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    if (gameReset) {
      setTime(0);
    }
    return () => clearInterval(timerInterval);
  }, [gameOn, gameReset]);

  return(
    <div>{timeFormat(time)}</div>
  )
}
