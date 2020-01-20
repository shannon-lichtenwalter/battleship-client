import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Input, Required, Label } from '../Form/Form';
import AuthApiService from '../../Services/auth-api-service';
import Button from '../Button/Button';
import Banner from '../Banner/Banner';
import './Signup.css';

class Signup extends Component {
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
    this.firstInput.current.focus()
  };

  render() {
    const { error } = this.state;
    return (
      <div>
        <Banner />
        
        <form className='signupform' onSubmit={this.handleSubmit}>
          <div role='alert'>
            { error && <p>{ error }</p>}
          </div>

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
      </div>
    );
  };
  
};

export default withRouter(Signup);


