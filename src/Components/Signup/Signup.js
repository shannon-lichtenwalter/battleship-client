import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Input, Required, Label } from '../Form/Form';
import AuthApiService from '../../Services/auth-api-service';
import Button from '../Button/Button';
import Banner from '../Banner/Banner';
import './Signup.css';
import TokenService from '../../Services/token-service';

class Signup extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => { }
  };
  
  state = { error: null };
  firstInput = React.createRef();

  handleSubmit = (ev) => {
    ev.preventDefault()
    const { username, password, email } = ev.target

    let user = username.value;
    let pass = password.value;

    AuthApiService.postUser({
      username: user,
      password: pass,
      email: email.value
    })
      .then(() => {

        email.value = ''
        username.value = ''
        password.value = ''

        AuthApiService.postLogin({
          username:user,
          password:pass
        })
        .then((res) => {

          TokenService.saveAuthToken(res.authToken);

          this.props.history.push('/dashboard');

        })
        .catch(() => this.props.history.push('/login'))
        
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  };

  componentDidMount() {
    this.firstInput.current.focus()
  };

  render() {
    let errorMessage = this.state.error ? <p className='errorMessage'>{this.state.error}</p>: null;
    return (
      <section className='signup'>
        <Banner />
        <h1>Sign up</h1>
        
        <form className='signupform' onSubmit={this.handleSubmit}>
          

          <div>
            <Label htmlFor='signup-email-input'>Enter your Email<Required /></Label>
            <Input
              ref={this.firstInput}
              id='signup-email-input'
              name='email'
              required
            />
          </div>

          <div>
            <Label htmlFor='signup-username-input'>Choose a username<Required /></Label>
            <Input
              id='signup-username-input'
              name='username'
              required
            />
          </div>

          <div>
            <Label htmlFor='signup-password-input'>Choose a password<Required /></Label>
            <Input
              id='signup-password-input'
              name='password'
              type='password'
              required
            />
          </div>
          {errorMessage}
          <div className='signupbtn'>
            <Button type='submit'>Sign up</Button>
            {' '}

            <Button onClick={() => {
              this.props.history.push('/guest')
            }}> Guest
            </Button> <br />
          </div>

          <div className='btnLink'>
            <Link to='/login'>Already have an account?</Link>
          </div>
        
        </form>
      </section>
    );
  };
  
};

export default withRouter(Signup);


