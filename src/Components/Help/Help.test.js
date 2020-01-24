import React from 'react';
import ReactDOM from 'react-dom';
import Help from './Help';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Help component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><Help /></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Displays the Help component when rendered', () => {
    const wrapper = mount(<Router><Help /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it(`Contains an 'h3' element for showing how to play`, () => {
    const wrapper = mount(<Router><Help /></Router>)
    expect(wrapper.contains(<h3>How to play</h3>)).toEqual(true)
  });

  it(`Contains an 'h3' element for showing how to resume an active game`, () => {
    const wrapper = mount(<Router><Help /></Router>)
    expect(wrapper.contains(<h3>Resuming an active game</h3>)).toEqual(true)
  });

  it(`Contains an 'h3' element for showing how to start a new game`, () => {
    const wrapper = mount(<Router><Help /></Router>)
    expect(wrapper.contains(<h3>New Game</h3>)).toEqual(true)
  });
  
});