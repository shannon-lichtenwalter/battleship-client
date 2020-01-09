import React from 'react';
import UserGrid from '../UserGrid/UserGrid';
import OpponentGrid from '../OpponentGrid/OpponentGrid';
import BattleShipContext from '../../Contexts/battleship-context';
import './GameBoard.css';

class GameBoard extends React.Component {

  /*
  
    export object = {
        hits
        misses
        our Ships
    }

    import object = {
        our hits 
        our misses
        opponents hits/misses
        our ships
        whose turn
    }

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
  }
}

export default GameBoard;