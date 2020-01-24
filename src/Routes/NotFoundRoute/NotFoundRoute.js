import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Button from '../../Components/Button/Button';

class NotFoundRoute extends Component {

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

export default withRouter(NotFoundRoute);


