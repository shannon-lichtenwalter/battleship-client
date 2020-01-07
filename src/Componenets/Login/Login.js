import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default class Login extends Component {

  render() {
    return (
      <form className='loginform'>
        <div>
          <label htmlFor='login-username-input'>Username</label>
          <input
            id='login-username-input'
            name='username'
            required
          />
        </div>

        <div>
          <label htmlFor='login-password-input'>Password</label>
          <input
            id='login-password-input'
            name='password'
            required
          />
        </div>

        <button type='submit'>Login</button>
        <button>
          <Link to='/guest'>
            Guest
          </Link>
        </button> <br />

        <Link to='/signup'>Need to create an account?</Link>
      </form>

      // <footer>
      // Copyright © since 2020
      // </footer>
    );
  };
  
};


