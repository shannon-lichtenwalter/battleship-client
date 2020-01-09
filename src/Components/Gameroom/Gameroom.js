import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './Gameroom.css';

export default class Gameroom extends Component {

  render() {
    return (
      <div>
        <p>Gameboard</p>
        <p>Chat</p>

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


