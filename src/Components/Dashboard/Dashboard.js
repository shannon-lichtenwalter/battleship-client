import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default class Dashboard extends Component {

  

  render() {
    return (
      <div className='dashboard'>
        <h1>Statuses</h1>
        
        <div className='stats'>
          <h2>Win</h2>
          <p># times</p>

          <h2>Lose</h2>
          <p># times</p>

          <h2>Draw</h2>
          <p># times</p>

          <h2>Win Ratio</h2>
          <p># / #</p>
        </div>

        <div className='d-button'>
          <button>
            <Link to='/ai'>
              AI
            </Link>
          </button>
          
          <button>
            <Link to='/live'>
              Live
            </Link>
          </button>

          <button>
            <Link to='/passive'>
              Passive
            </Link>
          </button>
        </div>

        <footer>
          Copyright © since 2020
        </footer>
      </div>
    );
  };
  
};


