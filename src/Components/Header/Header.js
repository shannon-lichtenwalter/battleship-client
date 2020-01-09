import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TokenService from '../../Services/token-service';
import Button from '../Button/Button';

class Header extends Component {

  render() {
    return (
      <header>
        <Button>
          <Link to='/setting'>
            Setting
          </Link>
        </Button>

        <Button>
          <Link to='/help'>
            Help
          </Link>
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


