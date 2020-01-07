import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Setting.css';

export default class Setting extends Component {

  render() {
    return (
      <div className='setting'>
        <h1>Setting</h1>
        <div className='setting-p'>
          <p>Delete Account</p>
          <p>Reset Account</p>
          <p>Password Change</p>
          <p>Username Change</p>
        </div>

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


