import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import Banner from '../Banner/Banner';
import './Help.css';
import Header from '../Header/Header';

class Help extends Component {

  render() {
    return (
      <div>
        <Banner />
        <Header />
        
        <div className='help'>
          <h1>Help</h1>
          <div className='helpIB'>
            <h2>Instructions</h2>
            <ul>
              <li>1. If you want to start a new game, then select "Start a New Game". <br />
                  Or if you want to play passive with random person, then select "Resume Game?".</li>
              <li>2. Go into the "Gameroom" with friend.</li>
              <li>3. Select your battleships to play game. <br />
                  Follow instructions on the "Gameboard".
              </li>
              <li>4. Hit and Fire opponent's battleships.</li>
              <li>5. Enjoy your battleship game! :)</li>
            </ul>
          </div>

          <div className='helpIB'>
            <h2>Bug Report</h2>
            <ul>
              <li>1. Email: </li>
              <li>2. Contact Info: </li>
              <li>3. Contact Info: </li>
              <li>4. Contact Info: </li>
            </ul>
          </div>

          <Button onClick={() => {
            this.props.history.goBack();
          }}> Back
          </Button>

          <Footer />
        </div>
      </div>
    );
  };
};

export default withRouter(Help);


