import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

export default class Signup extends Component {

  render() {
    return (
      <form className>
        <div>
          <label htmlFor='signup-name-input'>Name</label>
          <input
            id='signup-name-input'
            name='name'
            required
          />
        </div>

        <div>
          <label htmlFor='signup-username-input'>Userame</label>
          <input
            id='signup-username-input'
            name='username'
            required
          />
        </div>

        <div>
          <label htmlFor='signup-password-input'>Password</label>
          <input
            id='signup-password-input'
            name='password'
            required
          />
        </div>

        <button type='submit'>Sign up</button>
        <button>
          <Link to='/guest'>
            Guest
          </Link>
        </button> <br />

        <Link to='/login'>Already have an account?</Link>
      </form>

      // <footer>
      // Copyright © since 2020
      // </footer>
    );
  };
  
};


