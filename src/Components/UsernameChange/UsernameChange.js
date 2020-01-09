import React, { Component } from 'react';
import { Input, Required, Label } from '../Form/Form';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';

class UsernameChange extends Component {

  firstInput = React.createRef();

  render() {
    return (
      <div>
        <h1>Username Change</h1>
        <form>
          <div>
            <Label htmlFor='username-change'>New Username<Required /></Label>
            <Input 
              ref={this.firstInput}
              id='username-change'
              name='newUsername'
              required
            />
          </div>

          <div>
            <Label htmlFor='confirm-username-change'>Confirm New Username<Required /></Label>
            <Input 
              id='confirm-username-change'
              name='confirmNewUsername'
              required
            />
          </div>

          <Button>
            <Link to='/dashboard'>
              Done
            </Link>
          </Button>
        </form>

        <Footer />
      </div>
    )
  }
}

export default UsernameChange;