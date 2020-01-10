import React, { Component } from 'react';
// import { Input, Required, Label } from '../Form/Form';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';

class DeleteAccount extends Component {
  
  render() {
    return (
      <div>
        <h1>Delete Account</h1>
        <h2>Really want to delete account? <br /> Are you sure??</h2>
        <p>Need to think about how will be look likes...</p>

        <Button onClick={() => {
            this.props.history.push('/signup')
          }}> Done
        </Button>

        <Footer />
      </div>
    )
  }
}

export default withRouter(DeleteAccount);