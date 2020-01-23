import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TokenService from '../../Services/token-service';
import Banner from '../Banner/Banner';
import Button from '../Button/Button';
import './Header.css'

class Header extends Component {

  render() {
    let firstButton = null;

    if (this.props.location.pathname !== '/dashboard') {
      firstButton = <Button onClick={() => {
        this.props.history.push('/dashboard')
      }}> Dashboard
          </Button>
    } else {
      firstButton = <Button onClick={() => {
        this.props.history.push('/history')
      }}> History
          </Button>
    }

    return (
      <div>
        <Banner />

        <header className='main-header'>
          {firstButton}
          
          <Button onClick={() => {
            this.props.history.push('/help')
          }}> Help
          </Button>

          <Button onClick={() => {
            TokenService.clearAuthToken()
            this.props.history.push('/login')
          }}>
            Logout
          </Button>
        </header>
      </div>
    )
  };
};

export default withRouter(Header);


