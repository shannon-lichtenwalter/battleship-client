import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import Banner from '../Banner/Banner';
import './Help.css';

class Help extends Component {

  render() {
    return (
      <div>
        <Banner />
        
        <div className='help'>
          <h1>Help</h1>
          <div className='helpIB'>
            <h2>Instructions</h2>
            <ul>
              <li>1. How to Play</li>
              <li>2. How to Play</li>
              <li>3. How to Play</li>
              <li>4. How to Play</li>
              <li>5. How to Play</li>
            </ul>
          </div>

          <div className='helpIB'>
            <h2>Bug Report</h2>
            <ul>
              <li>1. Contact Info</li>
              <li>2. Contact Info</li>
              <li>3. Contact Info</li>
              <li>4. Contact Info</li>
            </ul>
          </div>

          <Button onClick={() => {
            this.props.history.push('/dashboard')
          }}> Exit
          </Button>

          <Footer />
        </div>
      </div>
    );
  };
};

export default withRouter(Help);


