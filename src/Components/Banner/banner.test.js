/* eslint-disable no-unused-expressions */
import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Banner from './Banner'

describe(`Banner Component`, () => {
    it(`Renders without errors`, () => {
        const div = document.createElement('div');
        ReactDOM.render(<Banner /> , div)
        ReactDOM.unmountComponentAtNode(div)
    })

    it(`Displays the headline 'BATTLESHIP'`, () => {
        const wrapper = shallow(<Banner />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })

    it(`Contains an 'h1' element with headline`, () => {
        const wrapper = shallow(<Banner />)
        expect(wrapper.contains(<h1>BATTLESHIP</h1>)).toEqual(true)
    });
});

