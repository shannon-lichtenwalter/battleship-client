import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
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

        <Button>
          <Link>
            Rematch
          </Link>
        </Button>

        <Button>
          <Link>
            New Game
          </Link>
        </Button>

        <Button>
          <Link to='/dashboard'>
            Exit
          </Link>
        </Button>

        <Footer />
      </div>
    );
  };
  
};


