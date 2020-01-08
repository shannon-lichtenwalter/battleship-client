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
    const { location, history } = this.props
    const destination = (location.state || {}).from || '/'
    history.push(destination)
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


