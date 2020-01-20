import React from 'react';
import ReactDOM from 'react-dom';
import OpponentGrid from './OpponentGrid';
import io from 'socket.io-client';
import config from '../../config';
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
    ReactDOM.render(<OpponentGrid socket={socket}/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
})