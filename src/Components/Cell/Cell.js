import React from 'react';
import './Cell.css';

class Cell extends React.Component {

  static defaultProps ={
    selected:null,
    idNumber:-2,
    shipTiles:[],
    allShipTiles:[],
  }

constructor(props){
  super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      occupied: null,
      hasBeenShot: null,
      index: this.findMyIndex, 
      isShipTile:false, 
  }
  //this.findMyIndex = this.findMyIndex.bind(this)
}

// componentDidMount(){
//   if ((this.props.shipTiles) && (this.props.shipTiles.indexOf(this.props.currentId)!==(-1))){
//     this.setState({shipTile:true})
//   }
//   this.checkForShipTile()
// }

// updateShipTile=(value, selected)=>{
//   console.log(value)
//   console.log(selected)
//   //console.log(this.state.x + this.state.y)
//   if(value === selected){
//     this.setState({shipTile : true})
//   }
// }

determineClassName = () => {
  //console.log(this.props.selected)
  //console.log(this.props.id)
  let className = 'cell';
  if(this.props.hits && this.props.hits.includes(this.props.id)){
    className += ' hit'
  } else
  if (this.props.misses && this.props.misses.includes(this.props.id)){
    className += ' miss'
  }

  // the following is determining classNames for cells of resumedGames only.
  if(this.props.resumedGame){
    let shipSpaces = [];
    this.props.playerShips.map(ship => {
      return ship.spaces.map(space => shipSpaces.push(space))
    })
      if(shipSpaces.includes(this.props.id)){
        className += ' ship'
        if(this.props.opponentHits){
          if(this.props.opponentHits.includes(this.props.id)){
          className += '-shot'
          }
        }
      }else if (this.props.opponentMisses){
        if(this.props.opponentMisses.includes(this.props.id)) {
        className += ' shot'
        }
      }
    };


  if(this.props.allShipTiles.length > 0){
      if (this.props.allShipTiles.indexOf(this.props.idNumber) !== (-1)){
        className += ' ship'
        if(this.props.opponentShots && this.props.opponentShots.includes(this.props.id)) {
          className += '-shot'
        }
      } else if(this.props.opponentShots && this.props.opponentShots.includes(this.props.id)) {
        className += ' shot'
      }
  
  } 

  else if (this.props.selected === this.props.id) {
    className += ' selected'
    //console.log(this.props.shipTiles)
  } 

  return className;
}

checkForShipTile = () => {
  console.log(this.props.allShipTiles)
  console.log(this.props.currentId)

  if ((this.props.allShipTiles) && (this.props.allShipTiles.indexOf(this.props.currentId)!==(-1)) ){
   this.setState({isShipTile:true})
 }
 //this.render()
}

canCellBeClicked = () => {
  //console.log('here');
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
}

handleClick = () => {
  this.checkForShipTile()
  //console.log('yes');
  let click = this.canCellBeClicked();
  if(click){
    //this.checkForShipTile()
    this.props.handleSelectTarget(this.props.id, this.props.idNumber)
  }
  //this.checkForShipTile()
}

  render () {
    //console.log(this.props.id)
    return (
      //Adding in an id of label for the cells that are not part of the 
      //gameplay but are the labels for the board.
      <div id=
      {this.props.label 
        ? 'label' 
        : ''} 
        //style={this.state.shipTile ? { 'backgroundColor': 'blue' } : null}
        className={this.determineClassName()}
        onClick={() => this.handleClick()}
                            >
        {this.props.id}
      </div>
    )
  }
}

export default Cell;
