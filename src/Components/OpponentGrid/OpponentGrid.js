import React from 'react';
import Cell from '../Cell/Cell';
import './OpponentGrid.css';

class OpponentGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      //hard coding these for testing, will need from database in future
      opponentShips: [{ 'name': 'Aircraft Carrier', 'length': 5, 'spaces': ['A4','A5','A6','A7', 'A8'] },
      { 'name': 'Battleship', 'length': 4, 'spaces': ['H3', 'H4', 'H5', 'H6'] },
      { 'name': 'Cruiser', 'length': 3, 'spaces': ['I1', 'I2', 'I3'] },
      { 'name': 'Submarine', 'length': 3, 'spaces': ['E1', 'F1', 'G1'] },
      { 'name': 'Defender', 'length': 2, 'spaces': ['D2', 'D3'] }],
      result: null,
      message: null,
      hits: [],
      misses: [],
    }
  }

    handleSelectTarget = (value) => {
    this.setState({
      selected: value,
      message: null,
    })
  }
//this function checks the opponent ships stored in state to see if a hit was made. This will need
// to be refactored to check the database to see if a hit was made.
  checkForHits = () => {
    let result = 'miss';
    this.state.opponentShips.forEach(ship => {
      if(ship.spaces.includes(this.state.selected)){
        this.setState({
            result: 'hit',
            message: `Direct Hit on the ${ship.name}!`,
            hits: [...this.state.hits, this.state.selected],
            selected: null,
          })
          result = 'hit'
      }
    })
    return result;
  }
//this function checks to see if the result was a hit. If not it will return the miss message and store
// the selected value in the state for misses. This will need
// to be refactored to check the database to see if a hit/miss was made.
  checkForMisses = (result) => {
    if(result !== 'hit'){
      this.setState({
        result: 'miss',
        message: 'Missed the target!',
        misses: [...this.state.misses, this.state.selected],
        selected: null,
      })
  }
}
//this will need to be refactored to check the database for hit/miss
  handleFire = (event) => {
    event.preventDefault();
    if(this.state.selected === null){
      this.setState({
        message: 'Must Choose a Target'
      })
    }else {
      let result = this.checkForHits();
      this.checkForMisses(result);
    }
  }

  findMyIndex = (letter, num) => {
    let temp = 0;
    switch (letter) {
      case ('A'):
        temp = num
        break;
      case ('B'):
        temp = num + 10
        break;
      case ('C'):
        temp = num + 20
        break;
      case ('D'):
        temp = num + 30
        break;
      case ('E'):
        temp = num + 40
        break;
      case ('F'):
        temp = num + 50
        break;
      case ('G'):
        temp = num + 60
        break;
      case ('H'):
        temp = num + 70
        break;
      case ('I'):
        temp = num + 80
        break;
      case ('J'):
        temp = num + 90
        break;
    }
    return temp
  }

  handleRenderGrid = () => {
    //setting the rows and columns of the gameboard grid
    let y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    //map over the letters and for each letter return a 'column' div.
    //each 'column' div will have a style of 'display:inline-block' so that the
    // columns will align on the grid.
    return y.map((num, index) => {
      return (
        <div key={index} className='column'>
          {/* These cells will be the top row of the grid and will have a letter for each cell*/}
          <Cell id={num} label={true} />
          {x.map((letter, index) => {
            if (num === 0) {
              // these cells will be the most left coulumn and will have the numbers listed in each cell.
              return <Cell key={letter} id={letter} label={true} />
            }
            return <Cell key={letter + num}
              id={letter + num}
              idNumber={this.findMyIndex(letter, num)}
              x={num}
              y={letter}
              handleSelectTarget={this.handleSelectTarget}
              selected={this.state.selected}
              hits={this.state.hits}
              misses={this.state.misses}
            />
          })}
        </div>
      )
    })
  }

  render() {
    return (
      <div className='OpponentContainer'>
        <div className='OpponentGrid'>
          {this.handleRenderGrid()}
        </div>
        <h2 className='message'>{this.state.message && this.state.message} </h2>
        <h3>Select your target</h3>
        <p>You have selected: {this.state.selected}</p>
        <form onSubmit={(event)=> this.handleFire(event)}>
          <button type='submit'> Fire!</button>
        </form>
      </div>
    )
  }
}

export default OpponentGrid;

