import React from 'react';
import ReactDOM from 'react-dom';
import GameBoard from './GameBoard';

describe('GameBoard component', () => {
  let gameData = {
      currentUser: null,
      gameId: null,
      opponentHits: [],
      opponentMisses: [],
      opponentShips: null,
      room_id: null,
      turn: null,
      userHits: [],
      userMisses: [],
      userShips: [],
      shipTileValues: [],
      resumedGame: null,
      shipsReady: null,
    }

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GameBoard gameData={gameData}/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});


