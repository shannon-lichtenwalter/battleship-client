import React from 'react';
import UserGrid from '../UserGrid/UserGrid';
import './GameBoard.css';

class GameBoard extends React.Component {

  /*
  
    export object = {
        hits
        misses
        our Ships
    }

    import object = {
        our hits 
        our misses
        opponents hits/misses
        our ships
        whose turn
    }

  */ 


  /*
        Add opponents hits/misses to state
  */
  state = {
    moves: [],
    ships: [],
    selected: null,
    opponentShips: [{'aircraft carrier': ['A4','A5','A6','A7']}, {'boat':['D2', 'D3']}],
    result: null,
    message: null,
    hits: [],
    misses: [],
  }

  // handleSelectTarget = (value) => {
  //   this.setState({
  //     selected: value,
  //     message: null,
  //   })
  // }

  checkForHits = () => {
    let result = 'miss';
    this.state.opponentShips.forEach(ship => {
      for(const key in ship){
        if (ship[key].includes(this.state.selected)){
          this.setState({
            result: 'hit',
            message: 'Direct Hit!',
            hits: [...this.state.hits, this.state.selected],
            selected: null,
            moves:[...this.state.moves, this.state.selected]
          })
          result = 'hit'
        }
      }  
    })
    return result;
  }

  checkForMisses = (result) => {
    if(result !== 'hit'){
      this.setState({
        result: 'miss',
        message: 'Missed the target!',
        misses: [...this.state.misses, this.state.selected],
        selected: null,
        moves:[...this.state.moves, this.state.selected]
      })
  }
}

  handleFire = (event) => {
    event.preventDefault();
    if(this.state.selected === null){
      this.setState({
        message: 'Must Choose a Target'
      })
    }else {
      let result = this.checkForHits();
      this.checkForMisses(result);
    }
  }



//   handleRenderGrid = () => {
//     //setting the rows and columns of the gameboard grid
//     let y= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//     let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
//     //map over the letters and for each letter return a 'column' div.
//     //each 'column' div will have a style of 'display:inline-block' so that the
//     // columns will align on the grid.
//     return y.map((num, index) => {
//       return (
//       <div key= {index} className='column'> 
//       {/* These cells will be the top row of the grid and will have a letter for each cell*/}
//       <Cell id={num} label={true} />
//         {x.map((letter, index) => {
//           if(num === 0){
//             // these cells will be the most left coulumn and will have the numbers listed in each cell.
//             return <Cell key={letter} id={letter} label={true}/>
//           }
//           return <Cell key={letter + num} 
//             id={letter + num} 
//             x={num} 
//             y ={letter} 
//             handleSelectTarget={this.handleSelectTarget} 
//             selected={this.state.selected}
//             hits={this.state.hits}
//             misses={this.state.misses}/>
//           })
//         }
//       </div>
//     )
//   })
// }

  render () {
    return (
      <>
        <div className='grid'>
          {/* {this.handleRenderGrid()} */}
          <UserGrid />
        </div>
        <h2 className='message'>{this.state.message && this.state.message} </h2>
        <h3>Select your target</h3>
        <p>You have selected: {this.state.selected}</p>
        <form onSubmit={(event)=> this.handleFire(event)}>
          <button type='submit'> Fire!</button>
        </form>
      </>
    )
  }
}

export default GameBoard;