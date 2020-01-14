import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Button from '../Button/Button';
import './Setting.css';

class Setting extends Component {

  render() {
    return (
      <div className='setting'>
        <h1>Setting</h1>
        <div>
          <ul>
            <li>
              <Link to='/deleteAccount'>
                Delete Account
              </Link>
            </li>
            <li>
              <Link to='/resetAccount'>
                Reset Account
                </Link>
            </li>
            <li>
              <Link to='/passwordChange'>
                Password Change
              </Link>
            </li>
            <li>
              <Link to='/usernameChange'>
                Username Change
              </Link>
            </li>
          </ul>
        </div>

        <Button onClick={() => {
          this.props.history.push('/dashboard')
        }}> Exit
        </Button>
          
        <Footer />
      </div>
    );
  };
};

export default withRouter(Setting);


