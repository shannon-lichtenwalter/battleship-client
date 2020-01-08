import React from 'react';
import './Cell.css';

class Cell extends React.Component {

  static defaultProps ={
    selected:null,
    idNumber:-2,
    shipTiles:[],
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
  } else
  if(this.props.shipTiles.length > 0){
      if (this.props.shipTiles.indexOf(this.props.idNumber) !== (-1)){
         className = 'ship'
      }
  //this.setState({shipTile:true})
  //} 
    //this.setState({shipTile:true})
  } 
  // if ((this.props.selected === this.props.id) && (this.props.shipTiles) && 
  //    (this.props.shipTiles.indexOf(this.props.id)!==(-1) && 
  //    this.state.shipTile)){
  //       className = 'ship'
  //   //this.setState({shipTile:true})
  // } 
  else if (this.props.selected === this.props.id) {
    className += ' selected'
    //console.log(this.props.shipTiles)
  } 
  // if ((this.props.selected === this.props.id) && (this.props.shipTiles.length > 0) && (this.props.shipTiles.indexOf(this.props.id)!==(-1))){
  //     className += ' ship'
  // }
   //else if (this.props.selected && this.props.shipOccupied.indexOf(this.props.id)!==(-1)) {
    //className += ' ship'
  //}
  return className;
}

checkForShipTile = () => {
  console.log(this.props.shipTiles)
  console.log(this.props.currentId)
  if ((this.props.shipTiles) && (this.props.shipTiles.indexOf(this.props.currentId)!==(-1)) ){
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
        style={this.state.shipTile ? { 'backgroundColor': 'blue' } : null}
        className={this.determineClassName()}
        onClick={() => this.handleClick()}
                            >
        {this.props.id}
      </div>
    )
  }
}

export default Cell;
