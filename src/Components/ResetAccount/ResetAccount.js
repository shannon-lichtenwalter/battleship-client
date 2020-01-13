import React, { Component } from 'react';
// import { Input, Required, Label } from '../Form/Form';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';

class ResetAccount extends Component {

  firstInput = React.createRef();

  render() {
    return (
      <div>
        <h1>Reset Account</h1>
        <h2>Really want to reset account? <br /> Are you sure??</h2>
        <p>Need to think about how will be look likes...</p>

        <Button onClick={() => {
          this.props.history.push('/dashboard')
        }}> Done
        </Button>
        
        <Footer />
      </div>
    )
  }
}

export default withRouter(ResetAccount);