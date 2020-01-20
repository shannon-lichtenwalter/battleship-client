import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Button from './Button'

describe(`Button Component`, () => {
    it(`Renders without errors`, () => {
        const div = document.createElement('div');
        ReactDOM.render(<Button /> , div)
        ReactDOM.unmountComponentAtNode(div)
    }),

    it(`Displays a button`, () => {
        const wrapper = shallow(<Button />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })

})