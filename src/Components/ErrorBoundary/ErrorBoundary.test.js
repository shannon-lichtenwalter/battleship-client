import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import ErrorBoundary from './ErrorBoundary.js'

describe(`Error Boundary Component`, () => {
    it(`Renders without errors`, () => {
        const wrapper = shallow(<ErrorBoundary />)
        wrapper.setState({hasError:true})
        expect(wrapper.text()).toMatchSnapshot()
    })

    it(`Displays the error boundary component when rendered`, () => {
        const wrapper = shallow(<ErrorBoundary />)
        wrapper.setState({hasError:true})
        setTimeout(() =>{
            expect(toJson(wrapper)).toMatchSnapshot()
        },500)
    })
    
    
    it(`Displays 'Uh oh! We've had a misfire! Please try returning to the homepage...' message on error`, () => {
        const wrapper = shallow(<ErrorBoundary />)
        wrapper.setState({hasError:true})
        expect(wrapper.text()).toMatch(/We've had a misfire!/)
    })

});