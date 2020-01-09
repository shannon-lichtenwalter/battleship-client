import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import './Landing.css';

export default class Landing extends Component {

  render() {
    return (
      <div className='landing'>
        <h1>Battleship</h1>
        <Button>
          <Link to='/login'>
            Login
          </Link>
        </Button>

        <Footer />
      </div>
    );
  };

};


