import React, { Component } from 'react';
// import { Input, Required, Label } from '../Form/Form';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Banner from '../Banner/Banner';
import Footer from '../Footer/Footer';
import './DeleteAccount.css';

class DeleteAccount extends Component {
  
  render() {
    return (
      <div>
        <Banner />

        <div className='settingOption'>
          <h1>Delete Account</h1>
          <h2>Really want to delete account? <br /> Are you sure??</h2>
          <p>Need to think about how will be look likes...</p>

          <Button onClick={() => {
              this.props.history.push('/setting')
            }}> Done
          </Button>

          <Footer />
        </div>
      </div>
    )
  }
}

export default withRouter(DeleteAccount);


