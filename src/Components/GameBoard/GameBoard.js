import React from 'react';
import UserGrid from '../UserGrid/UserGrid';
import OpponentGrid from '../OpponentGrid/OpponentGrid';
import './GameBoard.css';

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
    userTurn: false
  }

  render () {
    return (
      <>
      <h2>Your Ships</h2>
      <UserGrid />

      <h2>Opponent Ships</h2>
      <OpponentGrid />
      </>
    )
  };
};

export default GameBoard;


