import React from 'react';
import Cell from '../Cell/Cell';
import './OpponentGrid.css';

class OpponentGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      result: null,
      message: null,
      hits: this.props.hits ? this.props.hits : [],
      misses: this.props.misses ? this.props.misses : [],
      turn: this.props.userTurn,
      letterDropdown: '',
      numberDropdown: '',
    }
  };

  //set a listener for the response in websockets. 
  //Only call checkForHitOrMiss
  //who fired the shot.
  componentDidMount = () => {
    if(this.props.socket){
      this.props.socket.on('response', res => {
        if(this.props.playerNum === res.playerNum){
          this.checkForHitOrMiss(res.result, res.ship, res.sunk);
        }
      })
    }
  }

  //function will set the state to reflect the target that the user has selected
  handleSelectTarget = (value) => {
    this.setState({
      letterDropdown: value.charAt(0),
      numberDropdown: value.slice(1),
      selected: value,
      message: null,
    })
  }

  //changes the message displayed to the user if a hit/miss was made
  checkForHitOrMiss = (result, ship, sunk) => {
    if(ship === 'aircraftCarrier'){
      ship = 'Aircraft Carrier'
    }
    if (result === 'hit') {
      let message = `Direct Hit on ${this.props.opponentUsername}${this.props.opponentUsername.charAt(this.props.opponentUsername.length-1) === 's' 
      ? '\'' 
      : '\'s'} 
      ${ship.charAt(0).toUpperCase() + ship.slice(1)}!`
      
      if(sunk){
          message= `You sunk ${this.props.opponentUsername}${this.props.opponentUsername.charAt(this.props.opponentUsername.length-1) === 's' 
          ? '\'' 
          : '\'s'} 
          ${ship.charAt(0).toUpperCase() + ship.slice(1)}!`;
      };

      this.setState({
        result: 'hit',
        message,
        hits: [...this.state.hits, this.state.selected],
        selected: null,
        letterDropdown: '',
        numberDropdown: '',
      })
      } else {
      this.setState({
        result: 'miss',
        message: 'Missed the Target!',
        misses: [...this.state.misses, this.state.selected],
        selected: null,
        letterDropdown: '',
        numberDropdown: '',
      })
    }
  };

//this function makes sure a user has selected a target. If so, post request is 
//made to the database to determine if it was a hit or a miss on the opponents' ships.
//with the response from the database we call check for Hits and check for Misses which will update
//what the user sees based on a hit or a miss.
  handleFire = (event) => {
    event.preventDefault();
    if (this.state.selected === null) {
      this.setState({
        message: 'Must Choose a Target'
      })
    } else {
      this.props.socket.emit('fire', { 
        target: this.state.selected, 
        gameId: this.props.gameId, 
        playerNum: this.props.playerNum, 
        roomId: this.props.room })
    }
  }

  //handleRenderGrid instantiates the rows and columns of the gameboard grid with the x and y variables.
  //it maps over the letters (x) and for each letter returns a 'column' div. When mapping we account for the top 
  //row of the grid being the letters and the far left column being the number labels. 
  handleRenderGrid = () => {
    let y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    return y.map((num, index) => {
      return (
        <div key={index} className='column'>
          <Cell 
            id={num} 
            label={true} 
            />
          {x.map((letter, index) => {
            if (num === 0) {
              return <Cell 
                key={letter} 
                id={letter} 
                label={true} />
            }
            return <Cell 
              key={letter + num}
              id={letter + num}
              handleSelectTarget={this.handleSelectTarget}
              selected={this.state.selected}
              hits={this.state.hits}
              misses={this.state.misses} />
          })}
        </div>
      )
    })
  };

  //this function is used to determine what will be set in state.
  //if no value is selected then it resets back to the default state values.
  //if a number has previously been selected in the dropdown then it checks to see
  //if this is an acceptable letter and number combination based on the presence of the
  //combination in hits and misses in state. If the combination cannot be selected
  //due to it already being a hit or missed target-- then the state is reset by updating
  //the letter choice and clearing the past number choice.
  //otherwise, if there is no previous number dropdown then only the letter is updated in state.
  setLetterSelectedFromDropDown = () => {
    var e = document.getElementById('letter-dropdown');
    var value = e.options[e.selectedIndex].value;
    
    if (value === '') {
      this.setState({
        letterDropdown: '',
        numberDropdown: '',
        selected: null
      })
    } else if(this.state.numberDropdown){
      if(!this.state.hits.includes(value + this.state.numberDropdown) && !this.state.misses.includes(value + this.state.numberDropdown)){
        this.setState({
          letterDropdown: value,
          message:null,
          selected: value + this.state.numberDropdown
        })
      }
      else{
        this.setState({
          letterDropdown: value,
          message: null,
          numberDropdown: '',
          selected: null
        })
      }
    }
    else {
        this.setState({
          letterDropdown: value,
          message: null,
        })
    }
  }

  //this function updates the state with the chosen number in the dropdown menu.
  // there are less checks on this function because a user can only use the numeric
  //drop down if there is already a letter that has been chosen in the dropdown. Therefore,
  //we are only checking to see if an empty value has been selected (the menu label). If so
  //the data is cleared in the state. otherwise the number value is updated in state and 
  // the selected value is updated.
  setNumberSelectedFromDropDown = () => {
    var e = document.getElementById('number-dropdown');
    var value = e.options[e.selectedIndex].value;
    if(value === '') {
      this.setState({
        letterDropdown: '',
        numberDropdown: '',
        selected: null
      })
    }else{
    this.setState({
      message: null,
      numberDropdown: value,
      selected: this.state.letterDropdown + value
    })
    }
  }
  //this drop down menu will be an alternative to clicking the grid,
  //the purpose is to allow for keyboard users to select targets
  //easily and quickly.
  handleRenderDropDown = () => {
    let letters = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett'];
    let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    return (
      <form>
        <fieldset>
          <legend>Take Aim</legend>
            <div>
              <label htmlFor='letter-dropdown'>Y Coordinate:</label>
              <select value={this.state.letterDropdown} id='letter-dropdown' onChange={() => this.setLetterSelectedFromDropDown()}>
                <option value={''}>Letter</option>
                {letters.map((letter, index) => {
                  let counter = 0;
                  numbers.map(num => {
                    if (this.state.hits.includes(letter.charAt(0) + num) || this.state.misses.includes(letter.charAt(0) + num)){
                      counter++
                    }
                    return null
                  })
                  if(counter < 10){
                  return <option key={index} value={letter.charAt(0)}>{letter}</option>
                  }
                  return null
                })}
              </select>
            </div>
            <div>
              <label htmlFor='number-dropdown'>X Coordinate:</label>
              <select value={this.state.numberDropdown} id='number-dropdown' onChange={()=> this.setNumberSelectedFromDropDown()}>
                <option value={''}>Number</option>
                {this.state.letterDropdown && numbers.map((value, index) => {
                  if(!this.state.hits.includes(this.state.letterDropdown + value) && !this.state.misses.includes(this.state.letterDropdown + value)){
                  return <option key ={index} value={value}>{value}</option>
                  }
                  return null;
                })}
            </select>
          </div>
          <h4>You have selected target: {this.state.selected}</h4>
      </fieldset>
    </form>
    )
  }

  render() {
    let buttonDisableBool = (this.props.userTurn) ?
      <div className='target'>
        {this.handleRenderDropDown()}
        <form onSubmit={(event) => this.handleFire(event)}>
          <button type='submit'>Fire!</button>
        </form>
      </div>
      : <p>Waiting for {this.props.opponentUsername}{this.props.opponentUsername.charAt(this.props.opponentUsername.length-1) === 's' 
      ? '\'' 
      : '\'s'} move</p>;

    return (
      <div className='OpponentContainer grid'>
        <div className='OpponentGrid'>
          {this.handleRenderGrid()}
        </div>
        <h2 className='message'>{this.state.message && this.state.message} </h2>
        {buttonDisableBool}
      </div>
    )
  }
}

export default OpponentGrid;


