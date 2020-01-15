import React, { Component } from 'react';
import Result from '../../Components/Result/Result';

export default class ResultRoute extends Component {
  render() {
    return (
      <section>
        <Result player={this.props.location.resultProps} game={this.props.location.resultProps}/>
      </section>
    )
  }
}


