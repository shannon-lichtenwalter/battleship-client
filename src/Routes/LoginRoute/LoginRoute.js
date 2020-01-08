import React, { Component } from 'react';
import Login from '../../Components/Login/Login';

export default class LoginRoute extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  handleLoginSuccess = () => {
    const { history } = this.props
    history.push('/dashboard')
  };

  render() {
    return (
      <section className='login'>
        <h1>Login</h1>
        <Login 
          onLoginSuccess={this.handleLoginSuccess}
        />
      </section>
    )
  }
}


