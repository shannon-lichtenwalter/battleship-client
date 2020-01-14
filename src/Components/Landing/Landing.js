import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './Landing.css';

class Landing extends Component {

  render() {
    return (
      <div className='landingPage'>
        <div className='landing'>
          <h1>BATTLESHIP</h1>
            <div className='arrow-nav'>
              <a href='#app-info'>
                <div className='arrow'> 
                </div>
              </a>
            </div>
        </div>

        <div id='app-info'>
            <p>
              Welcome to Battleship! The interactive game where you can challenge
              opponents in the classic game of sinking ships. This application allows
              the user to play a live game of battleship against another user. The user will
              receive live updates on their opponents advancements on the game board. Additionally,
              user's have the ability to leave a game and return to it later.
              To test out the site please create a new accout, or log in with the username: ****
              and password: ****.

              Fire Away!
            </p>

            <Button onClick={() => {
                this.props.history.push('/login')
            }}> Proceed to Login
            </Button>
        </div>

      </div>
    );
  };

};

export default withRouter(Landing);


