import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
        
        <footer>
          Copyright © since 2020
        </footer>
      </div>
    );
  };
  
};


