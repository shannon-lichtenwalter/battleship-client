import React, { Component } from 'react';
import Login from '../../Components/Login/Login';
//import UserContext from '../../Contexts/UserContext';

export default class LoginRoute extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  render() {
    return (
      <section className='login'>
        <h1>Login</h1>

          <Login />
      </section>
    )
  }
}


