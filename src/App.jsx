import './App.css'
import {MainGame} from "./Game";

function App() {
  return (
    <div className="App">
      {/*only change of number of bombs count is handled*/}
      <MainGame rows={9} cols={8} bombs={14}/>
    </div>)
}

export default App
