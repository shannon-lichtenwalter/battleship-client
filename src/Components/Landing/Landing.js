import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './Landing.css';

class Landing extends Component {

  render() {
    return (
      <div className='landingPage'>
        <div className='landing'>
          <h1>BATTLESHIP</h1>
            <div className='arrow-nav'>
              <a href='#app-info'>
                <div className='arrow'> 
                </div>
              </a>
            </div>
        </div>

        <div id='app-info'>
            <p>
              Testingdjgfflhgskjhfsdkfhgdfghdskjghdkjfghigurh
            </p>

            <Button onClick={() => {
                this.props.history.push('/login')
            }}> Login
            </Button>
        </div>

      </div>
    );
  };

};

export default withRouter(Landing);
