import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TokenService from '../../Services/token-service';
import Button from '../Button/Button';
import './Header.css'

class Header extends Component {

  render() {
    return (
      <header>
        <Button onClick={() => {
          this.props.history.push('/setting')
        }}> Setting
        </Button>

        <Button onClick={() => {
          this.props.history.push('/help')
        }}> Help
        </Button>

        <Button onClick={( ) => {
          TokenService.clearAuthToken()
          this.props.history.push('/login')
        }}>
          Logout
        </Button>
      </header>
      
    )
  }
}

export default withRouter(Header);


