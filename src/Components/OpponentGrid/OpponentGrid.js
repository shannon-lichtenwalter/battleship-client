import React from 'react';
import Cell from '../Cell/Cell';


import BattleShipContext from '../../Contexts/battleship-context';
import './OpponentGrid.css';

class OpponentGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      result: null,
      message: null,
      hits: this.props.hits ? this.props.hits : [],
      misses: this.props.misses ? this.props.misses : [],
      turn: this.props.userTurn
    }
  };

  static contextType = BattleShipContext;

  componentDidMount = () => {
    this.props.socket.on('response', res => {
      console.log(res);
      if(this.context.playerNum === res.playerNum){
        this.checkForHits(res.result, res.ship);
        this.checkForMisses(res.result);
      }
    })
  }

  handleSelectTarget = (value) => {
    this.setState({
      selected: value,
      message: null,
    })
  }


  //changes the message displayed to the user if a hit was made
  checkForHits = (result, ship) => {
    if (result === 'hit') {
      this.setState({
        result: 'hit',
        message: `Direct Hit on the ${ship}!`,
        hits: [...this.state.hits, this.state.selected],
        selected: null,
      })
    }

  };

//changes the message displayed to the user if a miss was made

  checkForMisses = (result) => {
    if (result !== 'hit') {
      this.setState({
        result: 'miss',
        message: 'Missed the target!',
        misses: [...this.state.misses, this.state.selected],
        selected: null,
      })
    }

  };

//this function makes sure a user has selected a target. If so, post request is 
//made to the database to determine if it was a hit or a miss on the opponents' ships.
//with the response from the database we call check for Hits and check for Misses which will update
//what the user sees based on a hit or a miss.


  handleFire = (event) => {
    event.preventDefault();
    if (this.state.selected === null) {
      this.setState({
        message: 'Must Choose a Target'
      })

    } else {
      this.props.socket.emit('fire', { target: this.state.selected, gameId: this.context.gameId, playerNum: this.context.playerNum, roomId: this.props.room })

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
      default:
        temp = num
    }
    return temp
  };

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
  };

  render() {

    let buttonDisableBool = (this.props.userTurn) ?
      <div>
        <h3>Select your target</h3>
        <p>You have selected: {this.state.selected}</p>
        <form onSubmit={(event) => this.handleFire(event)}>
          <button type='submit'>Fire!</button>
        </form>
      </div>
      : null;

    return (
      <div className='OpponentContainer grid'>
        <div className='OpponentGrid'>
          {this.handleRenderGrid()}
        </div>
        <h2 className='message'>{this.state.message && this.state.message} </h2>
        {buttonDisableBool}
      </div>
    )
  }
}

export default OpponentGrid;


