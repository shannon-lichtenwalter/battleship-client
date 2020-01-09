import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default class Landing extends Component {

  render() {
    return (
      <div className='landing'>
        <h1>Battleship</h1>
        <button>
          <Link to='/login'>
            Login
          </Link>
        </button>

        {/* <footer>
          Copyright © since 2020
        </footer> */}
      </div>
    );
  };

};


