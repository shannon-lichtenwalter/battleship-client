import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../Header/Header';
import Button from '../Button/Button';

class NotFound extends Component {

  componentDidMount(){
    document.title = 'Page Not Found'
  }
  
  render() {
    return (
      <section>
        <Header />

        <h2>404 - Page not found</h2>
        <p>Try going back to your previous page.</p>

        <Button onClick={() => {
          this.props.history.goBack();
        }}> Back
        </Button>
      </section>
    );
  }
};

export default withRouter(NotFound);


