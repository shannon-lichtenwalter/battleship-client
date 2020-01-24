import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Button from '../Button/Button'
import { BrowserRouter as Router } from 'react-router-dom';


describe('Footer component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><Header /></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Displays the Header component when rendered', () => {
    const wrapper = mount(<Router><Header /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it('Contains three buttons linking to: Help, Login, or either History or Dashboard', () => {
    const wrapper = mount(<Router><Header /></Router>)
    expect(wrapper.find(Button)).toHaveLength(3)
  });
  
});