import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Result.css';

export default class Result extends Component {

  render() {
    return (
      <div className='result'>
        <h1>Result</h1>
        <div className='result-p'>
          <p>Hit Ratio</p>
          <p>Who Win</p>
          <p>Who Lose</p>
          <p>Missed</p>
          <p>Shots Fired</p>
        </div>

        <button>
          <Link>
            Rematch
          </Link>
        </button>

        <button>
          <Link>
            New Game
          </Link>
        </button>

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


