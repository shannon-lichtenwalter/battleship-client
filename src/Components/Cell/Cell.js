import React from 'react';
import './Cell.css';

class Cell extends React.Component {

  static defaultProps = {
    selected: null,
    idNumber: -2,
    shipTiles: [],
    allShipTiles: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      occupied: null,
      hasBeenShot: null,
      index: this.findMyIndex,
      isShipTile: false,
    }
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
    } else if (this.props.misses && this.props.misses.includes(this.props.id)) {
        className += ' miss'
      }

    if (this.props.shipTileValues) {
      if (this.props.shipTileValues.includes(this.props.id)) {
        className += ' ship'
        if (this.props.opponentShots && this.props.opponentShots.includes(this.props.id)) {
          className += '-shot'
        }
      } else if (this.props.opponentShots && this.props.opponentShots.includes(this.props.id)) {
        className += ' shot'
      }
    }
    else if (this.props.selected === this.props.id) {
      className += ' selected'
    }
    return className;
  }

  checkForShipTile = () => {
    if ((this.props.allShipTiles) && (this.props.allShipTiles.indexOf(this.props.currentId) !== (-1))) {
      this.setState({ isShipTile: true })
    }
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
    else {
      return true;
    }
  }

  handleClick = () => {
    this.checkForShipTile()
    let click = this.canCellBeClicked();
    if (click) {
      this.props.handleSelectTarget(this.props.id, this.props.idNumber)
    }
  }

  render() {
    return (
      <div 
        id={this.props.label ? 'label' : ''}
        className={this.determineClassName()}
        onClick={() => this.handleClick()}
      >
        {this.props.id}
      </div>
    )
  }
}

export default Cell;


