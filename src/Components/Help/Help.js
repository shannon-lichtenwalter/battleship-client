import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './Help.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

class Help extends Component {

  render() {
    return (
      <div>
        <Header />

        <div className='help'>
          <h1>Help</h1>
          <div className='helpIB'>
            <h2>Instructions</h2>

            <h3 className='left-h3'>Key:</h3>
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
              <div>
                <div className='cell ghostship'></div>
                <p className='long-string-style'>Ship Placement Ghost</p>
              </div>
              <div>
                <div className='cell ship ghostship'></div>
                <p className='long-string-style'>Failed Ship Placement Ghost</p>
              </div>
            </div>

            <section id='instructions-help'>
              <h3 className='left-h3'>How to play</h3>
              <ol>
                <li className='li-left-align'>1. Once both users have set their ships the match starts</li>
                <li className='li-left-align'>2. Players will take turns 'firing' upon eachother's ships attempting to 'sink' them</li>
                <li className='li-left-align'>3. Once one player has 'sunk' all of their opponent's ships the player wins</li>
              </ol>

              <h3 className='left-h3'>New Game</h3>
              <ol>
                <li className='li-left-align'>1. If you want to start a new game, then select "Start a New Game". </li>
                <li className='li-left-align'>2. Place each of your five ships one at a time on the grid.</li>
                <li>
                  <ul className='ul-list-stlying'>
                    <li className='li-left-align li-indent'>- To do so select an origin point. This is done by either clicking a tile on the grid or using the dropdown selectors</li>
                    <li className='li-left-align li-indent'>- Also set an alignment through use of the button labeled either 'Horizontal' or 'Vertical'. By clicking this button you may cycle between the two alignments.  The alignment shown is the chosen alignment.</li>
                    <li className='li-left-align li-indent'>- Once the green outline matches where you wish to place your ship you may click the submit button to set the ship</li>
                  </ul>
                </li>
                <li className='li-left-align'>3. Once both players have set their ships the match begins.</li>
              </ol>

              <h3 className='left-h3'>Resuming an active game</h3>
              <ol>
                <li className='li-left-align'>1. To resume a game its as easy as clicking the 'Resume Game' button on the game you wish to enter.</li>
                <li className='li-left-align'>2. Take note that not all games will have an opponent to start off with as we wait to match you against another person.</li>
                <li className='li-left-align'>3. Games where it is your turn to move are nearer to the top.</li>
              </ol>

              <h3 className='left-h3'>Forfeiting a match</h3>
              <ol>
                <li className='li-left-align'>1. If you no longer wish to continue a match you may select the 'Quit Game' button then the 'Quit Game Now' button from the dashboard.</li>
              </ol>
            </section>

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


