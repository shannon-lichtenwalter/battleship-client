import React from 'react';
import './Cell.css';

class Cell extends React.Component {

  constructor(props){
    super(props);
      this.state = {
        x: this.props.x,
        y: this.props.y,
        occupied: null,
        hasBeenShot: null,
        index: this.findMyIndex,  
    }
    //this.findMyIndex = this.findMyIndex.bind(this)
  };

  determineClassName = () => {
    let className= 'cell';

    if(this.props.hits && this.props.hits.includes(this.props.id)){
      className += ' hit'
    }
    else if (this.props.misses && this.props.misses.includes(this.props.id)){
      className += ' miss'
    } else if (this.props.selected === this.props.id) {
      className += ' selected'
    }
    return className;
  };

  canCellBeClicked = () => {
    console.log('here');
    if(this.props.hits && this.props.hits.includes(this.props.id)){
      return false;
    }
    else if (this.props.misses && this.props.misses.includes(this.props.id)){
      return false;
    }
    else if (this.props.label){
      return false;
    }
    else {
      return true;
    }
  };

  handleClick = () => {
    console.log('yes');
    let click = this.canCellBeClicked();
    if(click){
      this.props.handleSelectTarget(this.props.id)
    }
  };

  render () {

    //console.log(this.props.id)
    return (
      //Adding in an id of label for the cells that are not part of the 
      //gameplay but are the labels for the board.
      <div id=
      {this.props.label 
        ? 'label' 
        : ''} 
        className={this.determineClassName()}
        onClick={() => this.handleClick()}>
        {this.props.id}
      </div>
    )
  };
};

export default Cell;


