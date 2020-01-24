import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './Landing';
import Button from '../Button/Button'
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Landing component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><Landing /></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Displays the Landing page component when rendered', () => {
    const wrapper = mount(<Router><Landing /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it(`Contains an 'h1' title element`, () => {
    const wrapper = mount(<Router><Landing /></Router>)
    expect(wrapper.contains(<h1>BATTLESHIP</h1>)).toEqual(true)
  });
  
  it(`Contains an 'p' element displaying the game information`, () => {
    const wrapper = mount(<Router><Landing /></Router>)
    expect(wrapper.contains(/<p aria-label="app information" >/)).toEqual(true)
  });

  it(`Contains a button for logging in to the game`, () => {
    const wrapper = mount(<Router><Landing /></Router>)
    expect(wrapper.find(Button)).toHaveLength(1)
  })


});