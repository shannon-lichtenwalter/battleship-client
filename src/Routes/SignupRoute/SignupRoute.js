import React, { Component } from 'react';
import Signup from '../../Components/Signup/Signup'
import './SignupRoute.css';

export default class SignupRoute extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  handleRegistrationSuccess = () => {
    const { history } = this.props
    history.push('/signup')
  };
  
  render() {
    return (
      <section className='signup'>
        <h1>Sign up</h1>
        <Signup
          onRegistrationSuccess={this.handleRegistrationSuccess}
        />
      </section>
    )
  }
}


