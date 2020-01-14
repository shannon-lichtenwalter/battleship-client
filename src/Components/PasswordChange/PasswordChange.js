import React, { Component } from 'react';
import { Input, Required, Label } from '../Form/Form';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import Banner from '../Banner/Banner';
import './PasswordChange.css';

class PasswordChange extends Component {

  firstInput = React.createRef();

  render() {
    return (
      <div>
        <Banner />

        <div className='settingOption'>
          <h1>Password Change</h1>
          <form>
            <div>
              <Label htmlFor='password-change'>New Password<Required /></Label>
              <Input 
                ref={this.firstInput}
                id='password-change'
                name='newPassword'
                required
              />
            </div>

            <div>
              <Label htmlFor='confirm-password-change'>Confirm New Password<Required /></Label>
              <Input 
                id='confirm-password-change'
                name='confirmNewPassword'
                required
              />
            </div>

            <Button onClick={() => {
              this.props.history.push('/setting')
            }}> Done
            </Button>
          </form>

          <Footer />
        </div>
      </div>
    )
  }
}

export default withRouter(PasswordChange);