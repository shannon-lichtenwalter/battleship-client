import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Button from '../Button/Button'
import { BrowserRouter } from 'react-router-dom';

describe('Login Component', () => {
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render
      (<BrowserRouter> 
        <Login /> 
      </BrowserRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it(`Displays the 'Login' component when rendered`, () => {
    const wrapper = mount(<BrowserRouter><Login /></BrowserRouter>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it(`Contains an 'input' element for username`, () => {
    const wrapper = mount(<BrowserRouter><Login /></BrowserRouter>)
    expect(wrapper.contains(/<Input ref={this.firstInput} id='login-username-input' name='username' required aria-required /)).toEqual(true)
  });

  it(`Contains an 'input' element for password`, () => {
    const wrapper = mount(<BrowserRouter><Login /></BrowserRouter>)
    expect(wrapper.contains(/<Input ref={this.firstInput} id='login-password-input' name='password' type='password' required aria-required /)).toEqual(true)
  });

  it(`Contains a button for submitting the user name and password`, () => {
    const wrapper = mount(<BrowserRouter><Login /></BrowserRouter>)
    expect(wrapper.find(Button)).toHaveLength(1)
  });
  
});


