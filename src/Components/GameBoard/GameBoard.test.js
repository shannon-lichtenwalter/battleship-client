import React from 'react';
import ReactDOM from 'react-dom';
import GameBoard from './GameBoard';
import { MemoryRouter } from 'react-router-dom';

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

    beforeAll(() => {
      window.scrollTo = jest.fn();
    })

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><GameBoard gameData={gameData}/></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
})