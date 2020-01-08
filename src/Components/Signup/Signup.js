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
    const { name, username, password } = ev.target

    AuthApiService.postUser({
      name: name.value,
      username: username.value,
      password: password.value,
    })
      .then(user => {
        name.value = ''
        username.value = ''
        password.value = ''
        this.props.onRegistrationSuccess()
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  };

  componentDidMount() {
    console.log(this.firstInput)
    this.firstInput.current.focus()
  };

  render() {
    const { error } = this.state;
    return (
      <form className='signupform' onSubmit={this.handleSubmit}>
        <h1>Sign up</h1>
        <div role='alert'>
          { error && <p>{ error }</p>}
        </div>

        <div>
          <Label htmlFor='signup-name-input'>Name<Required /></Label>
          <Input
            ref={this.firstInput}
            id='signup-name-input'
            name='name'
            required
          />
        </div>

        <div>
          <Label htmlFor='signup-username-input'>Userame<Required /></Label>
          <Input
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

        <Button type='submit'>Sign up</Button>
        {' '}

        <Button>
          <Link to='/guest'>
            Guest
          </Link>
        </Button> <br />

        <Link to='/login'>Already have an account?</Link>
      </form>

      // <footer>
      // Copyright © since 2020
      // </footer>
    );
  };
  
};


