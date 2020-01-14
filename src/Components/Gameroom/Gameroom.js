import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Gameboard from '../GameBoard/GameBoard';
import Button from '../Button/Button';
import './Gameroom.css';

class Gameroom extends Component {

  render() {
    return (
      <div>
        <Gameboard gameData={this.props.gameData} /> 
        <p>Chat</p>

        <Button onClick={() => {
            this.props.history.push('/dashboard')
          }}> Exit
        </Button>

        <Footer />
      </div>
    );
  };
};

export default withRouter(Gameroom);


