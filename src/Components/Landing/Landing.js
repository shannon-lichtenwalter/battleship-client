import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './Landing.css';

class Landing extends Component {

  render() {
    return (
      <div className='landing'>
        <h1>Battleship</h1>
        
        <Button onClick={() => {
            this.props.history.push('/login')
        }}> Login
        </Button>

      </div>
    );
  };

};

export default withRouter(Landing);
