import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './Chat';
import { shallow } from 'enzyme'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

describe(`Chat component`, () => {

    it(`Renders without crashing`, () => {
        const div = document.createElement('div');
        ReactDOM.render(<Chat />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it(`Displays a chat window when rendered`, () => {
        const wrapper = shallow(<Chat />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })

    it(`Expects an input where the user can type a message, with a placeholder identifying it as such` , () => {
        const wrapper = shallow(<Chat />)
        expect(wrapper.contains(<input type='text' placeholder='Type Here' id='chatInput' aria-label='type message to opponent here' />)).toEqual(true)
    })

    it(`Expects an a message window where the user can see messages from the other player` , () => {
        const wrapper = shallow(<Chat />)
        expect(wrapper.contains(<ul id='chat-window'></ul>)).toEqual(true)
    })

    it(`Expects a label for the chat input area`, () => { 
        const wrapper = shallow(<Chat />)
        expect(wrapper.text()).toMatch(/Chat with Opponent/)
    })

    it(`Stores messages received from the other player from data found in component state`, () => {
        const wrapper = shallow(<Chat />)
        let newMessage = 'Hello!'
        let temp = []
        temp.push(newMessage)
        wrapper.setState({messages:temp})
        expect(wrapper.state().messages[0]).toHaveLength(6)
    })

});


