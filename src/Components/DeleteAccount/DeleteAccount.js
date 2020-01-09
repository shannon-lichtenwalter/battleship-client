import React, { Component } from 'react';
// import { Input, Required, Label } from '../Form/Form';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';

class DeleteAccount extends Component {
  
  render() {
    return (
      <div>
        <h1>Delete Account</h1>
        <p>Need to think about how will be look likes...</p>

        <Button>
          <Link to='/signup'>
            Done
          </Link>
        </Button>

        <Footer />
      </div>
    )
  }
}

export default DeleteAccount;