import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Dashboard component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><Dashboard /></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  })

  it('Displays the Dashboard component when rendered', () => {
    const wrapper = shallow(<Router><Dashboard /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})