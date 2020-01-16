import React from 'react';
import Cell from '../Cell/Cell';
import './UserGrid.css';
import gameMovesApiService from '../../Services/game-moves-api-service';

class UserGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: '',
      currentId: '',
      message: null,
      boat: [],
      counter: this.props.resumedGame && this.props.userShips.length > 0 ? 5 : 0,
      playerShips: this.props.userShips && this.props.userShips.length !== 0 ? this.props.userShips : [{ 'name': 'aircraftCarrier', 'length': 5, 'spaces': [] },
      { 'name': 'battleship', 'length': 4, 'spaces': [] },
      { 'name': 'cruiser', 'length': 3, 'spaces': [] },
      { 'name': 'submarine', 'length': 3, 'spaces': [] },
      { 'name': 'defender', 'length': 2, 'spaces': [] }],
      shipOccupied: [],
      allShipTilesOccupied: [],
      shipTileValues: this.props.shipTileValues,
      currentShipAlignment: null,
      shipTileLaid: false,
      opponentShots: this.props.opponentShots,
      shipsReady: this.props.shipsReady,
      placementFail: false,
      resumedGame: this.props.resumedGame,
    }
  };



  //This function is called by the render. It will look at the counter value to determine
  // if the user still needs to set their ship locations or if all the ship values have been set.
  //counter was added to state in order to access the different ships, counter is incremeneted in a later function
  //after a boat has been completely built. If all the boats have been build, then an API call is made to update the
  //player's ships location in the database.

  handleSetShips = () => {
    if (this.state.counter === 5 && !this.props.shipsReady) {
      gameMovesApiService.setShips(this.state.playerShips, this.props.gameId, this.props.playerNum)
        .then(() => {
          this.props.setShipsReady();
          this.props.socket.emit('ships_ready', this.props.room);
        })
        .catch((e) => {
          this.props.setError(e);
          this.setState({
            selected: '',
            currentId: '',
            boat: [],
            counter: 0,
            playerShips: [{ 'name': 'aircraftCarrier', 'length': 5, 'spaces': [] },
            { 'name': 'battleship', 'length': 4, 'spaces': [] },
            { 'name': 'cruiser', 'length': 3, 'spaces': [] },
            { 'name': 'submarine', 'length': 3, 'spaces': [] },
            { 'name': 'defender', 'length': 2, 'spaces': [] }],
            shipOccupied: [],
            allShipTilesOccupied: [],
            shipTileValues: [],
            currentShipAlignment: null,
            shipTileLaid: false,
            opponentShots: [],
            shipsReady: false,
            placementFail: false,
          })
        });
    } else if (this.state.counter <= 4) {
      return `Please select cells for ${this.state.playerShips[this.state.counter].name}.
            This ship is ${this.state.playerShips[this.state.counter].length} spaces long`
    } else return `All Ships Have Been Set`
  };

  //this function takes the array from boat and sorts it in ascending order to determine if 
  //the user has skipped spaces when setting their boats
  checkBoatValidity = () => {
    let temp = []
    let temp2 = []
    let temp3 = []
    let status = true;
    for (let i = 0; i < this.state.boat.length; i++) {
      temp.push(this.state.boat[i].idNum)
    }
    temp.sort(function (a, b) { return a - b })

    for (let i = 0; i < temp.length - 1; i++) {
      if ((((temp[i + 1]) - temp[i]) !== 1) && (((temp[i + 1]) - temp[i]) !== 10)) {

        status = false;
      }
    }
    if (!status) {
      temp2 = this.state.allShipTilesOccupied
      temp2.splice(-temp.length, temp.length)
      temp3 = this.state.shipTileValues
      temp3.splice(-temp.length, temp.length)
    }

    return status
  };

  //this function is used as a callback function after updating the boat values in state. this will allow us to check and see if the
  //boat is finished being built. if so it will update the playerShips in state with the values. It will also reset the boat back to empty and will 
  //increment the counter in order to move on to the next boat to build.
  handleCheckBoatLength = () => {
    if (this.state.boat.length === this.state.playerShips[this.state.counter].length) {
      let status = this.checkBoatValidity()
      if (status) {
        let currentShips = this.state.playerShips;
        let boatValues = this.state.boat.map(boat => boat.value);

        currentShips[this.state.counter].spaces = boatValues
        this.setState({
          playerShips: currentShips,
          counter: this.state.counter + 1,
          boat: [],
          currentShipAlignment: null,
        })
      } else {
        this.messageCreator()
        this.setState({
          placementFail: true,
          boat: [],
          currentShipAlignment: null,
          shipOccupied: [],
        })
      }
    }
  };

  //This function is not currently being called- we can refactor it to
  //display the user's ships to them or we can remove.
  displayBoats = () => {
    return this.state.playerShips.map((ship, index) => {
      return <li key={index}>{ship.name} : {ship.spaces.length !== 0 ? ship.spaces.join(', ') : 'ship not built yet'}</li>
    })
  }

  handleCheckValue = (value, idNum) => {
    let tempBoat = this.state.boat
    let indexFound = tempBoat.map(function (e) {
      return e.idNum;
    }).indexOf(idNum)
    if (indexFound === (-1)) {
      if (this.state.boat.length <= this.state.playerShips[this.state.counter].length) {
        if ((this.state.boat.length === 0) && (this.state.shipTileLaid === false)) {
          this.setState({
            boat: [{ value, idNum }],
            shipOccupied: [idNum],
            shipTileLaid: true,
            allShipTilesOccupied: [idNum],
            shipTileValues: [value],
            placementFail: false,
          }, () => this.handleCheckBoatLength())
        }
        else if ((this.state.boat.length === 0 && this.state.shipTileLaid === true) && (this.state.allShipTilesOccupied.indexOf(idNum) === (-1))) {
          this.setState({
            boat: [{ value, idNum }],
            shipOccupied: [idNum],
            allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
            shipTileValues: [...this.state.shipTileValues, value],
            placementFail: false,
          }, () => this.handleCheckBoatLength())
        }
        else {
          let lastIdNum = idNum;
          let firstIdNum = this.state.boat.length > 0 ? this.state.boat[0].idNum : idNum
          let validHRangeHigh = 5 + firstIdNum > 100 ? 100 : 5 + firstIdNum;
          let validHRangeLow = (-5) + firstIdNum < 0 ? 0 : (-5) + firstIdNum;
          let validVRangeHigh = 50 + firstIdNum > 100 ? 100 : 50 + firstIdNum;
          let validVRangeLow = (-50) + firstIdNum < 0 ? 0 : (-50) + firstIdNum;
          let firstDigit = this.state.boat.length > 0 ? this.state.boat[0].value.charAt(0) : value.charAt(0)
          let firstCurrentDigit = value.charAt(0)

          if (lastIdNum <= validHRangeHigh && lastIdNum > validHRangeLow) {
            if (((lastIdNum === firstIdNum + 1) || (lastIdNum === firstIdNum - 1)) &&
              this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
              (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
              (this.state.currentShipAlignment !== 'vertical')) {
              if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                // if()
                //if((lastIdNum-1) % 10 != 0){
                this.setState({
                  boat: [...this.state.boat, { value, idNum }],
                  shipOccupied: [...this.state.shipOccupied, idNum],
                  currentShipAlignment: 'horizontal',
                  allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                  shipTileValues: [...this.state.shipTileValues, value],
                }, () => this.handleCheckBoatLength())
              } //this.state.currentShipAlignment !== 'horizontal'
            } else
              if ((lastIdNum === firstIdNum + 2 || lastIdNum === firstIdNum - 2) &&
                this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
                (this.state.playerShips[this.state.counter].length > 2) &&
                (this.state.currentShipAlignment !== 'vertical')) {
                if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                  this.setState({
                    boat: [...this.state.boat, { value, idNum }],
                    shipOccupied: [...this.state.shipOccupied, idNum],
                    currentShipAlignment: 'horizontal',
                    allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                    shipTileValues: [...this.state.shipTileValues, value]
                  }, () => this.handleCheckBoatLength())
                }
              } else
                if ((lastIdNum === firstIdNum + 3 || lastIdNum === firstIdNum - 3) &&
                  this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                  (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
                  (this.state.playerShips[this.state.counter].length > 3) &&
                  (this.state.currentShipAlignment !== 'vertical')) {
                  if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                    this.setState({
                      boat: [...this.state.boat, { value, idNum }],
                      shipOccupied: [...this.state.shipOccupied, idNum],
                      currentShipAlignment: 'horizontal',
                      allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                      shipTileValues: [...this.state.shipTileValues, value]
                    }, () => this.handleCheckBoatLength())

                  }
                } else
                  if ((lastIdNum === firstIdNum + 4 || lastIdNum === firstIdNum - 4) &&
                    this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                    (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
                    (this.state.playerShips[this.state.counter].length > 4) &&
                    (this.state.currentShipAlignment !== 'vertical')) {
                    if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                      this.setState({
                        boat: [...this.state.boat, { value, idNum }],
                        shipOccupied: [...this.state.shipOccupied, idNum],
                        currentShipAlignment: 'horizontal',
                        allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                        shipTileValues: [...this.state.shipTileValues, value]
                      }, () => this.handleCheckBoatLength())
                    }
                  }
          } else if (lastIdNum <= validVRangeHigh && lastIdNum > validVRangeLow) {
            if (((lastIdNum === firstIdNum + 10) || (lastIdNum === firstIdNum - 10)) &&
              this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
              (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
              (this.state.currentShipAlignment !== 'horizontal')) {
              this.setState({
                boat: [...this.state.boat, { value, idNum }],
                shipOccupied: [...this.state.shipOccupied, idNum],
                currentShipAlignment: 'vertical',
                allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                shipTileValues: [...this.state.shipTileValues, value]
              }, () => this.handleCheckBoatLength())
            } else
              if ((lastIdNum === firstIdNum + 20 || lastIdNum === firstIdNum - 20) &&
                this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
                (this.state.playerShips[this.state.counter].length > 2) &&
                (this.state.currentShipAlignment !== 'horizontal')) {
                this.setState({
                  boat: [...this.state.boat, { value, idNum }],
                  shipOccupied: [...this.state.shipOccupied, idNum],
                  currentShipAlignment: 'vertical',
                  allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                  shipTileValues: [...this.state.shipTileValues, value]
                }, () => this.handleCheckBoatLength())
              } else
                if ((lastIdNum === firstIdNum + 30 || lastIdNum === firstIdNum - 30) &&
                  this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                  (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
                  (this.state.playerShips[this.state.counter].length > 3) &&
                  (this.state.currentShipAlignment !== 'horizontal')) {
                  this.setState({
                    boat: [...this.state.boat, { value, idNum }],
                    shipOccupied: [...this.state.shipOccupied, idNum],
                    currentShipAlignment: 'vertical',
                    allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                    shipTileValues: [...this.state.shipTileValues, value]
                  }, () => this.handleCheckBoatLength())
                } else
                  if ((lastIdNum === firstIdNum + 40 || lastIdNum === firstIdNum - 40) &&
                    this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                    (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
                    (this.state.playerShips[this.state.counter].length > 4) &&
                    (this.state.currentShipAlignment !== 'horizontal')) {
                    this.setState({
                      boat: [...this.state.boat, { value, idNum }],
                      shipOccupied: [...this.state.shipOccupied, idNum],
                      currentShipAlignment: 'vertical',
                      allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                      shipTileValues: [...this.state.shipTileValues, value]
                    }, () => this.handleCheckBoatLength())
                  }
          }
        }
      }
    } else {
      // this else condition is to allow the user to unclick the tile when setting their ship
      let tempAllTilesOccupied = this.state.allShipTilesOccupied
      let tempAllTileValues = this.state.shipTileValues
      let tempShipOccupied = this.state.shipOccupied
      let tempBoat = this.state.boat
      let indexOfIdInAllTiles = tempAllTilesOccupied.indexOf(idNum)
      let indexOfIdInShipOccupied = tempShipOccupied.indexOf(idNum)
      let indexOfValueInAllTileValues = tempAllTileValues.indexOf(value)
      tempAllTilesOccupied.splice(indexOfIdInAllTiles, 1)
      tempAllTileValues.splice(indexOfValueInAllTileValues, 1)
      tempShipOccupied.splice(indexOfIdInShipOccupied, 1)
      tempBoat.splice(indexFound, 1)
      if (this.state.boat.length > 1) {
        this.setState({
          allShipTilesOccupied: tempAllTilesOccupied,
          shipTileValues: tempAllTileValues,
          shipOccupied: tempShipOccupied,
          boat: tempBoat
        })
      } else {
        //this set state will set currentShipAlignment to null if the length of the boat is 0 or 1.
        this.setState({
          allShipTilesOccupied: tempAllTilesOccupied,
          shipTileValues: tempAllTileValues,
          shipOccupied: tempShipOccupied,
          boat: tempBoat,
          currentShipAlignment: null,
        })
      }
    }
  };

  handleSelectTarget = (value, idNum) => {
    if (this.props.error) {
      this.props.clearError();
    }
    if (!this.state.shipsReady) {
      this.handleCheckValue(value, idNum);
      this.setState({
        selected: value,
        message: null,
        currentId: idNum
      })
    }
  };

  findMyIndex = (letter, num) => {
    let temp = 0;
    switch (letter) {
      case ('A'):
        temp = num
        break;
      case ('B'):
        temp = num + 10
        break;
      case ('C'):
        temp = num + 20
        break;
      case ('D'):
        temp = num + 30
        break;
      case ('E'):
        temp = num + 40
        break;
      case ('F'):
        temp = num + 50
        break;
      case ('G'):
        temp = num + 60
        break;
      case ('H'):
        temp = num + 70
        break;
      case ('I'):
        temp = num + 80
        break;
      case ('J'):
        temp = num + 90
        break;
      default:
        temp = num
    }
    return temp
  };

  messageCreator = () => {
    if (this.state.placementFail) {
      return 'Please try placing your ship again. Previous placement was invalid'
    } else {
      return null
    }
  };

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
              idNumber={this.findMyIndex(letter, num)}
              handleSelectTarget={this.handleSelectTarget}
              shipTiles={this.state.shipOccupied}
              allShipTiles={this.state.allShipTilesOccupied}
              shipTileValues={this.state.shipTileValues}
              opponentShots={this.state.opponentShots} />
          })
          }
        </div>
      )
    })
  };

  //componentDidMount will set a listener for the response from the websocket.
  //if the currentuser is not the user who fired the shot then they will get
  // a message displaying if they have been hit by the opponent or not.
  componentDidMount = () => {
    this.props.socket.on('response', data => {
      this.props.changeTurn();
      if (this.props.playerNum !== data.playerNum) {
        let message = null;
        if (data.result === 'miss') {
          message = `${data.playerNum} missed!`
        } else {
          if(data.sunk){
            message = `${data.playerNum} sunk your ${data.ship}!`
          }else{
            message = `${data.playerNum} ${data.result} your ${data.ship}`
          }
        }
        this.setState({
          message,
          opponentShots: [...this.state.opponentShots, data.target]
        })
      }
    })
  };

  render() {
    return (
      <div className='UserContainer grid'>
        <div className='UserGrid'>
          {this.handleRenderGrid()}

        </div>
        {this.state.message && <p>{this.state.message}</p>}
        <span className='ErrorSpan'><p>{this.messageCreator()}</p></span>
        <h2>{this.handleSetShips()} </h2>
      </div>
    )
  }
};

export default UserGrid;


