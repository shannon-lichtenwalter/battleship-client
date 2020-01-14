import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Gameboard from '../GameBoard/GameBoard';
import Banner from '../Banner/Banner';
import Button from '../Button/Button';
import './Gameroom.css';

class Gameroom extends Component {

  render() {
    return (








      <div className='gameroom'>
        <Banner />
        <Gameboard gameData={this.props.gameData} />


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


