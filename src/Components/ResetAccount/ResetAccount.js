import React, { Component } from 'react';
// import { Input, Required, Label } from '../Form/Form';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';

class ResetAccount extends Component {

  firstInput = React.createRef();

  render() {
    return (
      <div>
        <h1>Reset Account</h1>
        <p>Need to think about how will be look likes...</p>

        <Button>
          <Link to='/dashboard'>
            Done
          </Link>
        </Button>

        <Footer />
      </div>
    )
  }
}

export default ResetAccount;