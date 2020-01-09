import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './Help.css';

class Help extends Component {

  render() {
    return (
      <div className='help'>
        <h1>Help</h1>
        <div>
          <h2>Instructions</h2>
          <ul>
            <li>1. How to Play</li>
            <li>2. How to Play</li>
            <li>3. How to Play</li>
            <li>4. How to Play</li>
            <li>5. How to Play</li>
          </ul>
        </div>

        <div>
          <h2>Bug Report</h2>
          <ul>
            <li>1. Contact Info</li>
            <li>2. Contact Info</li>
            <li>3. Contact Info</li>
            <li>4. Contact Info</li>
          </ul>
        </div>

        <Button>
          <Link to='/dashboard'>
            Exit
          </Link>
        </Button>

        <footer>
          Copyright © since 2020
        </footer>
      </div>
    );
  };
  
};

export default withRouter(Help);
