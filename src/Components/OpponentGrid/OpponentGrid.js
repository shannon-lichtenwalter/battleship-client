import React from 'react';
import Cell from '../Cell/Cell';
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

  //set a listener for the response in websockets. 
  //Only call checkForHitOrMiss
  //who fired the shot.
  componentDidMount = () => {
    this.props.socket.on('response', res => {
      if(this.props.playerNum === res.playerNum){
        this.checkForHitOrMiss(res.result, res.ship, res.sunk);
      }
    })
  }

  handleSelectTarget = (value) => {
    this.setState({
      selected: value,
      message: null,
    })
  }

  //changes the message displayed to the user if a hit/miss was made
  checkForHitOrMiss = (result, ship, sunk) => {
    if (result === 'hit') {
      let message = `Direct Hit on the ${ship}!`
      
      if(sunk){
          message= `You sunk the ${ship}!`;
      };

      this.setState({
        result: 'hit',
        message,
        hits: [...this.state.hits, this.state.selected],
        selected: null,
      })
      } else {
      this.setState({
        result: 'miss',
        message: 'Missed the Target!',
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
      console.log('firing!')
      this.props.socket.emit('fire', { 
        target: this.state.selected, 
        gameId: this.props.gameId, 
        playerNum: this.props.playerNum, 
        roomId: this.props.room })
    }
  }

  //handleRenderGrid instantiates the rows and columns of the gameboard grid with the x and y variables.
  //it maps over the letters (x) and for each letter returns a 'column' div. When mapping we account for the top 
  //row of the grid being the letters and the far left column being the number labels. 
  handleRenderGrid = () => {
    let y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    return y.map((num, index) => {
      return (
        <div key={index} className='column'>
          <Cell 
            id={num} 
            label={true} 
            />
          {x.map((letter, index) => {
            if (num === 0) {
              return <Cell 
                key={letter} 
                id={letter} 
                label={true} />
            }
            return <Cell 
              key={letter + num}
              id={letter + num}
              handleSelectTarget={this.handleSelectTarget}
              selected={this.state.selected}
              hits={this.state.hits}
              misses={this.state.misses} />
          })}
        </div>
      )
    })
  };

  render() {
    let buttonDisableBool = (this.props.userTurn) ?
      <div className='target'> 
        <h3>Select your target</h3>
        <p>You have selected: {this.state.selected}</p>
        <form onSubmit={(event) => this.handleFire(event)}>
          <button type='submit'>Fire!</button>
        </form>
      </div>
      : <p>Waiting for opponent's move</p>;

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


