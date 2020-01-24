import React from 'react';
import ReactDOM from 'react-dom';
import Result from './Result';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Help component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><Result /></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it(`Displays the 'Result' component when rendered`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it(`Contains an 'h1' element for displaying the title`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(wrapper.contains(<h1>Result</h1>)).toEqual(true)
  });

  it(`Displays an area for the winner`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(wrapper.text()).toMatch(/Winner:/)
  });

  it(`Displays an area for the loser`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(wrapper.text()).toMatch(/Loser:/)
  });

  it(`Displays an area for the hit ratio`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(wrapper.text()).toMatch(/Hit Ratio:/)
  });

  it(`Displays an area for the total shots fired`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(wrapper.text()).toMatch(/Shots Fired:/)
  });

  it(`Displays an area for the total hits on the enemy vessel`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(wrapper.text()).toMatch(/Shots Hit:/)
  });

  it(`Displays an area for the total misses on the enemy vessel`, () => {
    const wrapper = mount(<Router><Result /></Router>)
    expect(wrapper.text()).toMatch(/Shots Missed:/)
  });
  
});