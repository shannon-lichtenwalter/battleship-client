import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AuthApiService from '../../Services/auth-api-service';
import UserContext from '../../Contexts/UserContext';
import { Input, Required, Label } from '../Form/Form';
import Button from '../Button/Button';
import TokenService from '../../Services/token-service';
import './Login.css';

class Login extends Component {
  static defaultProps = {
    onLoginSuccess: () => { }
  }

  static contextType = UserContext

  state = { error: null }

  firstInput = React.createRef()

  handleSubmit = ev => {
    console.log('success login')
    ev.preventDefault()
    const { username, password } = ev.target

    this.setState({ error: null })
    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })
      .then(res => {
        console.log(res)
        username.value = ''
        password.value = ''
        TokenService.saveAuthToken(res.authToken)
        const jwtPayload = TokenService.parseAuthToken()        
        console.log(jwtPayload)

      //   this.setUser({
      //     id: jwtPayload.user_id,
      //     username: jwtPayload.sub,
      // })
        console.log('line41')
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
            required
          />
        </div>

        <Button type='submit'>Login</Button>
        {' '}
        
        <Button>
          <Link to='/guest'>
            Guest
          </Link>
        </Button> <br />

        <Link to='/signup'>Need to create an account?</Link>
      </form>

      // <footer>
      //   Copyright © since 2020
      // </footer>
    );
  };
  
};

export default withRouter(Login);


