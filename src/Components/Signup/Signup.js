import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Required, Label } from '../Form/Form';
import AuthApiService from '../../Services/auth-api-service';
import Button from '../Button/Button';
import './Signup.css';

export default class Signup extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => { }
  };
  
  state = { error: null };
  firstInput = React.createRef();

  handleSubmit = ev => {
    ev.preventDefault()
    const { username, password, email } = ev.target

    AuthApiService.postUser({
      username: username.value,
      password: password.value,
      email: email.value
    })
      .then(user => {
        email.value = ''
        username.value = ''
        password.value = ''
        this.props.onRegistrationSuccess()
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  };

  componentDidMount() {
    //console.log(this.firstInput)
    this.firstInput.current.focus()
  };

  render() {
    const { error } = this.state;
    return (
      <form className='signupform' onSubmit={this.handleSubmit}>
        <div role='alert'>
          { error && <p>{ error }</p>}
        </div>

        <div>
          <Label htmlFor='signup-username-input'>Username<Required /></Label>
          <Input
            ref={this.firstInput}
            id='signup-username-input'
            name='username'
            required
          />
        </div>

        <div>
          <Label htmlFor='signup-password-input'>Password<Required /></Label>
          <Input
            id='signup-password-input'
            name='password'
            type='password'
            required
          />
        </div>

        <div>
          <Label htmlFor='signup-email-input'>Email<Required /></Label>
          <Input
            id='signup-email-input'
            name='email'
            required
          />
        </div>

        <Button type='submit'>Sign up</Button>
        {' '}

        <Button>
          <Link to='/guest'>
            Guest
          </Link>
        </Button> <br />

        <Link to='/login'>Already have an account?</Link>

        
      </form>
    );
  };
  
};


