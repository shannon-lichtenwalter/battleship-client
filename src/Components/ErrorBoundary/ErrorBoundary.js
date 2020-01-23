import React from 'react';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if(this.state.hasError){
      return (
        <div>
        <Header />
        <h3 className='errorHandler'> Uh oh! We've had a misfire! Please try returning to
          the homepage...
        </h3>
        <button>
          <Link to='/'>Home</Link>
        </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;