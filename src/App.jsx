import {useState} from 'react'
import bombIcon from './assets/react.svg'
import './App.css'
import {MainGame} from "./Game";

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={bombIcon} className="App-logo" alt="logo"/>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Minesweeper is loading...
  //       </a>
  //     </header>
  //   </div>
  // )

  return (
    <div className="App">
      <MainGame rows={9} cols={8} bombs={2}/>
    </div>)
}

export default App
