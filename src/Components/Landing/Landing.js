import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './Landing.css';

class Landing extends Component {
  componentDidMount(){
    document.title = 'Welcome to Battleship'
  }

  render() {
    return (
      <div className='landingPage'>
        <header className='landing'>
          <h1>BATTLESHIP</h1>
            <nav className='arrow-nav' aria-label='click to view app info'>
              <div className='arrow' onClick={()=> window.scrollTo(0,document.body.scrollHeight)}>
              </div>
            </nav>
        </header>

        <div id='app-info' aria-live='polite'>
            <p aria-label='app information'>
              Welcome to Battleship! The interactive game where you can challenge
              opponents in the classic game of sinking ships. This application allows
              the user to play a live game of battleship against another user. The user will
              receive live updates on their opponents advancements on the game board. Additionally,
              user's have the ability to leave a game and return to it later.
            </p>
            <p>
              To test out the site please create a new account, or log in with the username: TestUser1
              and password: Password123. To test the live game feature you will have to log in as a different
              user via a separate internet browser (ie: Safari, Chrome, Firefox etc.) OR log in on a mobile device
              using the username: TestUser2 and password: Password123. This will give you the ability to play against yourself
              in the two separate browsers. Alternatively, you may give the second user login information to a friend and 
              challenge them in a game of Battleship.

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


