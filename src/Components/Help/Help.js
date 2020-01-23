import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import './Help.css';
import Header from '../Header/Header';

class Help extends Component {

  render() {
    return (
      <div>
        <Header />
        
        <div className='help'>
          <h1>Help</h1>
          <div className='helpIB'>
            <h2>Instructions</h2>

            <p>Key:</p> 
            <div className='key'>
              <div>
                <div className='cell'></div>
                <p>Open Target</p>
              </div>
              <div>
                <div className='cell selected'></div>
                <p>Selected Target</p>
              </div>
              <div>
                <div className='cell hit'></div>
                <p>Hit Target</p>
              </div>
              <div>
                <div className='cell miss'></div>
                <p>Missed Target</p>
              </div>
              <div>
                <div className='cell ship'></div>
                <p>Ship Location</p>
              </div>
              <div>
                <div className='cell sunk'></div>
                <p>Sunken Ship</p>
              </div>
            </div>
            <ul>
              <li>1. If you want to start a new game, then select "Start a New Game". <br />
                  Or if you want to play passive with friend, then select "Resume Game ?".</li>
              <li>2. Go into the "Gameroom" with friend.</li>
              <li>3. Following the instructions on the "Gameboard", select your battleships to play the game.</li>
              <li>4. Hit and Fire opponent's battleships.</li>
              <li>5. Enjoy your battleship game with friend !</li>
              <li>6. You can see "Result" after finish the game.</li>
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


