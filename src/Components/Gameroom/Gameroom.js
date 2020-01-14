import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Gameboard from '../GameBoard/GameBoard';
import './Gameroom.css';

export default class Gameroom extends Component {

  render() {
    return (
      <div>
        <Gameboard gameData={this.props.gameData} /> 
        

        <button>
          <Link to='/dashboard'>
            Exit
          </Link>
        </button>
        
        <Footer />
      </div>
    );
  };
  
};


