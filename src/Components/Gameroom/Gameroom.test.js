import React from 'react';
import ReactDOM from 'react-dom';
import Gameroom from './Gameroom';
import { MemoryRouter } from 'react-router-dom';

describe('Gameroom component', () => {

  it('renders without crashing', () => {
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

    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><Gameroom gameData={gameData}/></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
})