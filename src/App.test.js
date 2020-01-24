import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';


describe(`App Component`, () => {
  
  it('Renders without errors', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router><App /></Router> , div)
    ReactDOM.unmountComponentAtNode(div)
    //expect(linkElement).toBeInTheDocument();
  });

  it('Renders the Landing Page by default', () => {
    const wrapper = mount(<Router><App /></Router>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

})

