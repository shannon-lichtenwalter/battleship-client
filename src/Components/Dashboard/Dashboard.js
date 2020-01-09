import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import './Dashboard.css';
//import TokenService from '../../Services/token-service';
import Header from '../Header/Header';

class Dashboard extends Component {

  render() {
    return (
      <div className='dashboard'>
        <Header />
        
        <div className='stats'>
          <h1>Statues</h1>
          <h2>Win</h2>
          <p># times</p>

          <h2>Lose</h2>
          <p># times</p>

          <h2>Draw</h2>
          <p># times</p>

          <h2>Win Ratio</h2>
          <p># / #</p>
        </div>

        <div className='d-button'>
          <Button>
            <Link to='/ai'>
              AI
            </Link>
          </Button>
          
          <Button>
            <Link to='/live'>
              Live
            </Link>
          </Button>

          <Button>
            <Link to='/passive'>
              Passive
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  };
  
};

export default withRouter(Dashboard);


