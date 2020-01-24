import React from 'react';
import ReactDOM from 'react-dom';
import Signup from './Signup';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BrowserRouter } from 'react-router-dom';

describe('Signup Component', () => {
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render
      (<BrowserRouter> 
        <Signup /> 
      </BrowserRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it(`Displays the signup page when rendered`, () => {
    const wrapper = mount(<BrowserRouter><Signup /></BrowserRouter>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });
  
});


