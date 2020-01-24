import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Dashboard component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><Dashboard /></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  })

  it('Displays the Dashboard component when rendered', () => {
    const wrapper = mount(<Router><Dashboard /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it(`Shows the current user's statistics`, () => {
    const wrapper = mount(<Router><Dashboard /></Router>)
    expect(wrapper.text()).toMatch(/Stats/)
  })

  it(`Show the current user 'Active Games', if any`, () => {
    const wrapper = mount(<Router><Dashboard /></Router>)
    expect(wrapper.text()).toMatch(/Return to an Active Game/)
  })
})