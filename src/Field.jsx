import React from 'react';

export const Field = (props) => {
  return (<div className="Field">
    {
      props.game.map((col, ci) => col.map(
        ((row, ri) => <Cell key={"" + ri + "_" + ci} data={props.game[ci][ri]}
                            handleOpening={() => props.handleOpening(ci, ri)}
                            handleFlagging={() => props.handleFlagging(ci, ri)}/>))
      )
    }
  </div>);
}

const Cell = (props) => {

  const prepareCss = () => {
    let styling = "Cell"
    if (props.data.isFlagged) {
      styling += " Cell-marked"
    }
    if (props.data.isOpen) {
      if (props.data.isBomb) {
        styling += " Cell-bomb"
      } else {
        styling += " Cell-empty"
      }
    }
    return styling;
  }

  const renderText = () => {
    if (props.data.isOpen && !props.data.isBomb && !props.data.isFlagged && props.data.count > 0) return props.data.count;
    return "";
  }
  // style
  return (<div className={prepareCss()} onContextMenu={props.handleFlagging}
               onClick={props.handleOpening}>{renderText()}</div>);
}