import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';


describe('Footer component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Footer />, div);
    ReactDOM.unmountComponentAtNode(div);
  })

  it('Displays the Footer component when rendered', () => {
    const wrapper = shallow(<Footer />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })


  it(`Displays copyright information`, () => {
    const wrapper = shallow(<Footer/>)
    expect(wrapper.text()).toMatch(/Copyright/)
  })
  
})