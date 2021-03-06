import React from 'react';
import './Cell.css';

class Cell extends React.Component {

  static defaultProps = {
    selected: null,
    idNumber: -2,
    shipTileValues: [],
  }

  //determineClassName is used to help with styling for the individual cells
  //based on if the cell is a ship, if it has been hit, or missed.
  //the the hits and miss props will only be passed in from the opponent grid.
  //the shipTileValues and opponentShots props will only be passed in from the user grid.
  //selected prop will only be passed down from opponent grid when selecting which cell
  //to fire upon.
  determineClassName = () => {
    let className = 'cell';

    if (this.props.hits && this.props.hits.includes(this.props.id)) {

      className += ' hit'
    } 
    else if (this.props.misses && this.props.misses.includes(this.props.id)) {
      className += ' miss'
    }    
    if(this.props.shipsCounter){
      let ships = this.props.shipsCounter;
      for (const key in ships){
        if(ships[key].sunk){
          if(ships[key].spaces.includes(this.props.id)){
            className = 'cell sunk'
          }
        }
      }
    }

    if(this.props.mySunkShipTileValues){
      if(this.props.mySunkShipTileValues.includes(this.props.id)){
        className += ' sunk';
      } else {
        if (this.props.shipTileValues.length > 0) {
          if (this.props.shipTileValues.includes(this.props.id)) {
            className += ' ship'
            if (this.props.opponentShots && this.props.opponentShots.includes(this.props.id)) {
              className += '-shot'
            }
          } else if (this.props.opponentShots && this.props.opponentShots.includes(this.props.id)) {
            className += ' shot'
          }
        }
      } 
    } else if (this.props.selected === this.props.id) {
          className += ' selected'
        }
        else if(this.props.label){
          className+= ' label'
        }

    if(this.props.ghostShip && this.props.ghostShip.includes(this.props.id)) {
      className += ' ghostship';
    }

    return className;
  }

  //This function checks to see if a cell is a label or has already been hit 
  //or missed on the opponentGrid. Cells that are labels or have already 
  //been hit or missed will not be clickable again.
  canCellBeClicked = () => {
    if (this.props.hits && this.props.hits.includes(this.props.id)) {
      return false;
    }
    else if (this.props.misses && this.props.misses.includes(this.props.id)) {
      return false;
    }
    else if (this.props.label) {
      return false;
    }
    else if (this.props.shipTileValues.length === 17) {
      return false;
    }
    else {
      return true;
    }
  }

  handleClick = () => {
    let click = this.canCellBeClicked();
    if (click) {
      this.props.handleSelectTarget(this.props.id)
    }
  }

  handleHover = () => {

  }

  render() {
    return (
      <div
        className={this.determineClassName()}
        onClick={() => this.handleClick()}
        onMouseOver={() => this.handleHover()}
      >
        {this.props.label ? this.props.id : ''}
      </div>
    )
  }
}

export default Cell;


