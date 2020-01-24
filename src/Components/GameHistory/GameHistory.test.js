import React from 'react';
import ReactDOM from 'react-dom';
import GameHistory from './GameHistory';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';


describe('GameHistory component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><GameHistory /></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it(`Displays the 'GameHistory' component when rendered`, () => {
    const wrapper = mount(<Router><GameHistory /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });


  it(`Displays message indicating if no game history is available`, () => {
    const wrapper = mount(<Router><GameHistory /></Router>)
    expect(wrapper.text()).toMatch(/No game history availiable/)
  });

  it(`Contains an 'h1' element for the game history`, () => {
    const wrapper = mount(<Router><GameHistory /></Router>)
    expect(wrapper.contains(<h1>Game History</h1>)).toEqual(true)
  });
  
})