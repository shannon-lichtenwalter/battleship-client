import React from 'react';
import ReactDOM from 'react-dom';
import GameBoard from './GameBoard';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';


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

  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><GameBoard gameData={gameData}/></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it(`Displays the Gameboard component (Container for UserGrid, OpponentGrid, Chat)`, () =>{
    const wrapper = mount(<Router><GameBoard gameData={gameData}/></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it(`Displays the user's progress towards destroying the other user's ships`, () => {
    const wrapper = mount(<Router><GameBoard gameData={gameData}/></Router>)
    expect(wrapper.text()).toMatch(/Progress/)
  });

  it(`Contains a Header component for error messages`, () => {
    const wrapper = mount(<Router><GameBoard gameData={gameData}/></Router>)
    expect(wrapper.find('Header')).toHaveLength(1)
  });

});


