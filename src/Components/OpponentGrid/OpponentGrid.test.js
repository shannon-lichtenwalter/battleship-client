import React from 'react';
import ReactDOM from 'react-dom';
import OpponentGrid from './OpponentGrid';
import io from 'socket.io-client';
import config from '../../config';
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import TokenService from '../../Services/token-service';


describe('OpponentGrid component', () => {
  const socket = io(config.API_ENDPOINT, {
    transportOptions: {
      polling: {
        extraHeaders: {
          'Authorization': `Bearer ${TokenService.getAuthToken()}`
        }
      }
    }
  });
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<OpponentGrid socket={socket} opponentUsername={'Sean'}/>, div);

    ReactDOM.unmountComponentAtNode(div);
  });

  it(`Displays the opponent grid when rendered`, () => {
    const wrapper = mount(<OpponentGrid opponentUsername={'Sean'}/>)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it(`Selects only the cell selected (A1) for a ship tile on the first click`, () =>{
    const wrapper = mount(<OpponentGrid opponentUsername={'Sean'}/>)
    wrapper.find('Cell').at(12).simulate('click')
    expect(wrapper.state().selected).toEqual('A1')
  });


})