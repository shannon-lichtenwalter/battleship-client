import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
          <Button onClick={() => {
            this.props.history.push('/ai')
          }}> AI
          </Button>
        
          <Button onClick={() => {
          this.props.history.push('/live')
          }}> live
          </Button>
          
          <Button onClick={() => {
          this.props.history.push('/passive')
          }}> Passive
          </Button>
        </div>
        
        <Footer />
      </div>
    );
  };
  
};

export default withRouter(Dashboard);


