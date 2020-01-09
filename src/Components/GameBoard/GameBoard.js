import React from 'react';
import UserGrid from '../UserGrid/UserGrid';
import io from 'socket.io-client';
import config from '../../config';
import OpponentGrid from '../OpponentGrid/OpponentGrid';
import BattleShipContext from '../../Contexts/battleship-context';
import './GameBoard.css';

const socket = io(config.URL, {
  transportOptions: {
    polling: {
      extraHeaders: {
        'Authorization' : 'Bearer thisismyjwt'
      }
    }
  }
  
});


class GameBoard extends React.Component {

  /*
  
    export object = {
        hits
        misses
        our Ships
    };

    import object = {
        our hits 
        our misses
        opponents hits/misses
        our ships
        whose turn
    };
  */ 


  /*
  Add opponents hits/misses to state
  */
  state = {
    userShips: [],
    opponentShips: [],
    userHits: [],
    userMisses: [],
    opponentHits: [],
    opponentMisses: [],
    userTurn: false,
    //hard coding gameId and playerNum for testing purposes temporarily
    gameId: 9,
    playerNum: 'player1',
    error: null,
  }

  //can we move this to a separate context provider file?
  setError = (err) => {
    this.setState({
      error: err.error
    })
  }

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



    //testing sockets.
    socket.emit('join_room', 'random')
    socket.on('joined', data => console.log(data))
  }
  componentDidMount = () =>{
    //fetch game data based on game id. set the state with the game data and pass
    //down as props to userGrid (needs ships for the user and opponent hits) and opponentGrid
    //(needs user's hits and misses to re-mark the board)
  }

  render () {
    return (
      <BattleShipContext.Provider value={{
        gameId: this.state.gameId,
        playerNum: this.state.playerNum,
        error: this.state.error,
        setError: this.setError
      }}>
      <>
      {this.state.error && <p className='errorMessage'>{this.state.error}</p>}
      <h2>Your Ships</h2>
      <UserGrid />

      <h2>Opponent Ships</h2>
      <OpponentGrid />
      </>
      </BattleShipContext.Provider>
    )
  };
};

export default GameBoard;


