import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AuthApiService from '../../Services/auth-api-service';
import { Input, Required, Label } from '../Form/Form';
import Button from '../Button/Button';
import TokenService from '../../Services/token-service';
import './Login.css';

class Login extends Component {
  static defaultProps = {
    onLoginSuccess: () => { }
  }

  state = { error: null }

  firstInput = React.createRef()

  handleSubmit = ev => {
    ev.preventDefault()
    const { username, password } = ev.target

    this.setState({ error: null })
    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })
      .then(res => {
        username.value = ''
        password.value = ''
        TokenService.saveAuthToken(res.authToken)
      
        this.props.history.push('/dashboard')
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  componentDidMount() {
    this.firstInput.current.focus()
  }

  render() {
    return (
      <form className='loginform' onSubmit={event => this.handleSubmit(event)}>
        <div>
          <Label htmlFor='login-username-input'>Username<Required /></Label>
          <Input
            ref={this.firstInput}
            id='login-username-input'
            name='username'
            required
          />
        </div>

        <div>
          <Label htmlFor='login-password-input'>Password<Required /></Label>
          <Input
            id='login-password-input'
            name='password'
            type='password'
            required
          />
        </div>

        <div className='loginbtn'>
          <Button type='submit'>Login</Button>
          {' '}
          
          <Button onClick={() => {
            this.props.history.push('/guest')
          }}> Guest
          </Button> <br />
        </div>

        <div className='btnLink'>
          <Link to='/signup'>Need to create an account?</Link>
        </div>
      </form>
    );
  };
  
};

export default withRouter(Login);


