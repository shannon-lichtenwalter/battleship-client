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


    /*
        The following React lifecycle method is invoked immediately after the 'UserGrid' component is 
        mounted from the 'GameGoard' component. Being the UserGrid, an event listener is set up to listen
        (via websockets, specifically the Socket.IO JavaScript library) for the 'response' event emitted
        from the server. The player's turn is changed based on that response, the array containing the data
        of opponent shots is updated in state, and a 'hit' or 'miss' message is displayed based on the response
        from the server.
    */
//     componentDidMount = () => {
//         if(this.props.socket){
//         this.props.socket.on('response', data => {
//           if(data){  
//           this.props.changeTurn();
//             if (this.context.playerNum !== data.playerNum) {
//                 let message = null;
//                 if (data.result === 'missed') {
//                     message = `${data.playerNum} missed!`
//                 } else {
//                     message = `${data.playerNum} ${data.result} your ${data.ship}`
//                 }
//                 // On response (indicating a shot was fired from the other side), 'message' in state is updated
//                 // as well as the array containing 'opponentShots'
//                 this.setState({
//                     message,
//                     opponentShots: [...this.state.opponentShots, data.target]
//                 })
//             }
//           }
//         })
//     }
//     };

    /*
        The following function 'handleSetShips' is called from within the render function. It will look at the 
        counter value to determine if the user still needs to set their ship locations, or if all the ship tiles
        have been set. A counter is added to state and incremented upon each valid boat being built. After the
        boats are built, a call is made to update the players' ships (essentially the tiles occupied by ships)
        via the 'gameMovesAPIService' API service. Server is also notified by the 'ships_ready' socket event.

        @return Message to either set a ship 'x' that is 'y' cells in length, or message indicating all ships
                have been set.
    */
    handleSetShips = () => {
        if (this.state.counter === 5 && !this.props.shipsReady) {
            // The following uses the 'gameMovesApiService' to notify backend that our ships are set, and
            //     sends ship placement data. Current game ID as well as player number is taken from context 
            gameMovesApiService.setShips(this.state.playerShips, this.context.gameId, this.context.playerNum)
                .then(() => {
                    this.props.setShipsReady();
                    this.props.socket.emit('ships_ready', this.props.room);
                }) // In the event of an error setting ships, all data is reset
                .catch((e) => {
                    this.context.setError(e);
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
                        shipTileValues:[],
                        currentShipAlignment: null,
                        shipTileLaid: false,
                        opponentShots: [],
                        shipsReady: false,
                        placementFail: false,
                    })
                });         // Continue to set ship tiles until all boats are set
        } else if (this.state.counter <= 4) {
            return `Please select cells for ${this.state.playerShips[this.state.counter].name}.
            This ship is ${this.state.playerShips[this.state.counter].length} spaces long`


    } else return `Your Fleet is Ready for Battle...`
  };


    /*
        The following function is called from within the 'handleCheckBoatLength' function when the 'boat'
        array in state reaches the length of the current ship being set. This check is made to ensure that the 
        ships being created do not have empty cells between them (which is currently allowed, with current 
        ship setting logic). If the ship is laid out in a horizontal arrangement, when the temporary array
        holding boat id numbers (equivalent of cell index), is sorted, taking the difference between two 
        consecutive array indices should yield the result of 1 each time, unless a cell was skipped. This logic 
        can be applied to the vertical arrangement as well, where we would expect a difference of 10 between
        consecutive, sorted array cells, otherwise a cell was skipped. If a cell is skipped, this is an 
        invalid boat arrangement, because your ship lacks coherence.

        @return status - Whether boat was a valid build or invalid
    */
    checkBoatValidity = () => {
        let temp = []
        let temp2 = []
        let status = true;
        for (let i = 0; i < this.state.boat.length; i++) { // Array 'temp' needed to store all
            temp.push(this.state.boat[i].idNum)
        }
        temp.sort(function (a, b) { return a - b })    // Custom sort function needed to work with numbers
        for (let i = 0; i < temp.length - 1; i++) {    // Boat validity based on difference between cell id's
            if ((((temp[i + 1]) - temp[i]) !== 1) && (((temp[i + 1]) - temp[i]) !== 10)) {
                status = false;     // Status set to 'false' indicates that the boat is invalid.
            }
        } 
        if (!status) {   // If the boat is invalid, cell data must be purged from array containing ship tiles
            temp2 = this.state.allShipTilesOccupied
            temp2.splice(-temp.length, temp.length)
        }
        return status
    };


    /*  
        The following function is used as a callback function after updating the boat values in state. The 
        function checks the boat length to see if the ship is complete, and sends it to the 'checkBoatValidity'
        function to be validated. If valid, 'playerShips' in state is updated, as well as the counter 
        indicating how many boats have been built

    */
    handleCheckBoatLength = () => {
        if (this.state.boat.length === this.state.playerShips[this.state.counter].length) {
            let status = this.checkBoatValidity()        // Function call to see if boat created is valid
            if (status) {                                // If current boat is valid..
                let currentShips = this.state.playerShips;
                let boatValues = this.state.boat.map(boat => boat.value);
                currentShips[this.state.counter].spaces = boatValues 
                // Sets 'playerShips' in state to newly updated current ship values, increases boat
                //    counter, and sets the alignment to null to get ready for the next ship
                this.setState({
                    playerShips: currentShips,
                    counter: this.state.counter + 1,
                    boat: [],
                    currentShipAlignment: null,
                })
            } else {        // Occurs when the boat is determined to be invalid
                this.messageCreator()   // Call to 'messageCreator' results in error message being returned
                this.setState({         // Reset current boat in order to place again
                    placementFail: true,
                    boat: [],
                    currentShipAlignment: null,
                    shipOccupied: [],
                })
            }
        }
    };

    
    /*
        This function is called by render as a visual tool for the user to see which cells they have
        selected for each boat. Display is based on values within 'playerShips' in componenet state.

        @return - HTML displaying all of the User's boats, as well as cells occupied by each boat.
    */
    displayBoats = () => {
        return this.state.playerShips.map((ship, index) => {
            return <li key={index}>{ship.name} : {ship.spaces.length !== 0 ? ship.spaces.join(', ') : 'ship not built yet'}</li>
        })
    }

    /*
        The following function contains the main logic behind user ship placement. When the user initially
        selects a tile for their first ship, this is selected as the first tile for the placement of their
        ship (which is automatically the aircraft carrier, when placing for the first ship). Valid ship tiles
        are arranged around the placement of the first tile for each boat. After the first tile is set, the 
        user can choose to arrange their ship either horizontally or vertically. Once the user selects their 
        second ship tile, the arrangement is locked to either being horizontal or vertical. The user has the 
        option of choosing tiles in order or out of order for each boat. The user is also able to un-select the
        tiles of their current ship. This is called from the 'handleSelectTarget' function.

        @params value - value ( example - 'A1') of currently selected tile
        @params idNum - index of currently selected tile.

    */
    handleCheckValue = (value, idNum) => {
        // The following lines are used to see whether or not the tile you are selecting is found within
        //    your current boat. If found, its index (or id) is returned, otherwise -1 is returned
        let tempBoat = this.state.boat                  
        let indexFound = tempBoat.map(function (e) {
            return e.idNum;
        }).indexOf(idNum)
        if (indexFound === (-1)) {  // If the idNum of newly selected ship tile is not null...
            // Next line checks to see whether the size of the current boat is less than or equal to its proper length
            if (this.state.boat.length <= this.state.playerShips[this.state.counter].length) {
                // Next line calls setState for the very first ship tile laid.
                if ((this.state.boat.length === 0) && (this.state.shipTileLaid === false)) {
                    this.setState({
                        boat: [{ value, idNum }],           // Array of boat object, set value and idNum of boat tile 
                        shipOccupied: [idNum],              // Array containing index of each cell (tile) in current boat
                        shipTileLaid: true,                 // Boolean, false if no ship tiles laid
                        allShipTilesOccupied: [idNum],      // Array containing index of each ship tile in total
                        shipTileValues: [value],            // Array containing alphanumeric cell indices of all ships
                        placementFail: false,               // Boolean if boat placement failed
                    }, () => this.handleCheckBoatLength())
                }
                // setState for the first tile of each subsequent ship 
                else if ((this.state.boat.length === 0 && this.state.shipTileLaid === true) && (this.state.allShipTilesOccupied.indexOf(idNum) === (-1))) {
                    this.setState({
                        boat: [{ value, idNum }],
                        shipOccupied: [idNum],
                        allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                        shipTileValues: [...this.state.shipTileValues, value],
                        placementFail: false,
                    }, () => this.handleCheckBoatLength()) // Callback to see whether tile filled boat reqs
                }
                /*
                     The following calls setState for ship cells other than the first cell. Ship arrangement
                     is based on the first cell being placed. There is a valid max and min for both horizontal
                     and vertical ship alignment 
                */
                else {
                    let lastIdNum = idNum;
                    let firstIdNum = this.state.boat.length > 0 ? this.state.boat[0].idNum : idNum
                    let validHRangeHigh = 5 + firstIdNum > 100 ? 100 : 5 + firstIdNum;
                    let validHRangeLow = (-5) + firstIdNum < 0 ? 0 : (-5) + firstIdNum;
                    let validVRangeHigh = 50 + firstIdNum > 100 ? 100 : 50 + firstIdNum;
                    let validVRangeLow = (-50) + firstIdNum < 0 ? 0 : (-50) + firstIdNum;
                    // First digit of boat, as well as current cell are needed when comparing cells for
                    //   ships that are aligned horizontally, to prevent you from creating ships that extend 
                    //   across multiple lines
                    let firstDigit = this.state.boat.length > 0 ? this.state.boat[0].value.charAt(0) : value.charAt(0)
                    let firstCurrentDigit = value.charAt(0)
                    // Next line determines if the cell selected is within valid range, horizontally
                    if (lastIdNum <= validHRangeHigh && lastIdNum > validHRangeLow) {
                        // Next lines checks to see if the cell selected is one cell away from boat origin,
                        //    makes sure its not a previously selected ship cell, makes sure it is within
                        //    a valid range from the boat origin(first cell selected for ship), and that 
                        //    the alignement wasn't already set to vertical, making this an invalid move
                        if (((lastIdNum === firstIdNum + 1) || (lastIdNum === firstIdNum - 1)) &&
                            this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                            (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
                            (this.state.currentShipAlignment !== 'vertical')) {
                            // Makes sure we are setting cells that are arranged horizontally, on the same row
                            if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                                // setState in horizontal direction updates the current boat tiles, 'ship
                                //     occupied' and 'allShipTiles' , and sets the direction to horizontal.
                                //     'handleCheckBoatLength' function is invoked as callback to see if boat
                                //     requirements have been fulfilled.
                                this.setState({
                                    boat: [...this.state.boat, { value, idNum }],
                                    shipOccupied: [...this.state.shipOccupied, idNum],
                                    currentShipAlignment: 'horizontal',
                                    allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                                    shipTileValues: [...this.state.shipTileValues, value],
                                }, () => this.handleCheckBoatLength())
                            }
                        } else // If the cell selected is two cells away from the boat origin
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
                                        shipTileValues: [...this.state.shipTileValues, value],
                                    }, () => this.handleCheckBoatLength())
                                }
                            } else // If the cell selected is 3 cells away from the boat origin
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
                                            shipTileValues: [...this.state.shipTileValues, value],
                                        }, () => this.handleCheckBoatLength())
                                    }
                                } else // If the cell selectedis 4 cells away from the boat origin
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
                                                shipTileValues: [...this.state.shipTileValues, value],
                                            }, () => this.handleCheckBoatLength())
                                        }
                                    }
                    //  The following checks to see if when laying ship tiles vertically, we are in valid range 
                    } else if (lastIdNum <= validVRangeHigh && lastIdNum > validVRangeLow) {
                        // Are we directly above or below the boat origin?
                        if (((lastIdNum === firstIdNum + 10) || (lastIdNum === firstIdNum - 10)) &&
                            this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                            (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
                            (this.state.currentShipAlignment !== 'horizontal')) {
                            // setState in vertical alignment sets the 'currentShipAlignment' to vertical
                            //    in state. Once set, change to horizontal cannot be made
                            this.setState({
                                boat: [...this.state.boat, { value, idNum }],
                                shipOccupied: [...this.state.shipOccupied, idNum],
                                currentShipAlignment: 'vertical',
                                allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
                                shipTileValues: [...this.state.shipTileValues, value]
                            }, () => this.handleCheckBoatLength())
                        } else // If two cells above, or below boat origin
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
                            } else // If three cells above, or below boat origin
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
                                } else // If four cells above, or below boat origin
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
        // The following block of code allows users to unselect ship tiles for the current boat if they change
        //     their mind, or are 'up against a wall' and find themselves unable to place their final ship tile
        //     due to another boat being in the way. 
        } else {
            let tempAllTilesOccupied = this.state.allShipTilesOccupied
            let tempAllTileValues = this.state.shipTileValues
            let tempShipOccupied = this.state.shipOccupied
            let tempBoat = this.state.boat
            let indexOfIdInAllTiles = tempAllTilesOccupied.indexOf(idNum)
            let indexOfIdInShipOccupied = tempShipOccupied.indexOf(idNum)
            let indexOfValueInAllTileValues = tempAllTileValues.indexOf(value)
            // Location of tile selected is found from relevant arrays in state, and purged via splice array method
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
                // If the length of the boat is 1, we are setting 'currentShipAlignment' to null, so the user can
                //    change direction of ship placement.
      } else {
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

    /*
        Passed as a callback to the cell component, the following function checks to see whether any cell
        can be selected, by checking to see if all ships have been placed on the UserGrid. Sets the cell as
        the currently selected cell
    */
    handleSelectTarget = (value, idNum) => {
        if (this.context.error) {
            this.context.clearError();
        }
        if (!this.state.shipsReady) {
            this.handleCheckValue(value, idNum);
            this.setState({
                selected: value,
                //boat: [...this.state.boat, value],
                message: null,
                currentId: idNum
                //selected: idNum
            })
            //this.handleCheckValue(value, idNum);
        }
    };

    /*
        Function determines the cell index (idNumber) based off of it's alphanumeric value. Passed
        to the Cell component and assigned from within

        @param letter- Letter portion of cell alphanumeric value
        @param num - Number portion of cell alphanumeric value
        @return temp - Index number representing it's alphanumeric number
    */
    findMyIndex = (letter, num) => {
        let temp = 0;
        switch (letter) {
            case ('A'):             // Coincides with the first playable row, A1 - A10
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
                temp = num + 90     // Coincides with the last playable row, J1 - J10
                break;
            default:
                temp = num
        }
        return temp
    };

    /*
        Display placement error message, if applicable


        @return - String message displaying placement error, or null
    */
    messageCreator = () => {
        if (this.state.placementFail) {
            return 'Please try placing your ship again. Previous placement was invalid'
        } else {
          return null

  //componentDidMount will set a listener for the response from the websocket.
  //if the currentuser is not the user who fired the shot then they will get
  // a message displaying if they have been hit by the opponent or not.
  componentDidMount = () => {
    this.props.socket.on('response', data => {
      this.props.changeTurn();
      let ship = null;
      if(data.ship === 'aircraftCarrier'){
        ship = 'Aircraft Carrier'
      }else if (data.ship !== null) {
        ship = data.ship.charAt(0).toUpperCase() + data.ship.slice(1)
      }

      if (this.props.playerNum !== data.playerNum) {
        let message = null;
        if (data.result === 'miss') {
          message = `${this.props.opponentUsername} missed!`
        } else {
          if(data.sunk){
            message = `${this.props.opponentUsername} sunk your ${ship}!`
          }else{
            message = `${this.props.opponentUsername} ${data.result} your ${ship}`

          }
        }

    /*
        Function called from render to display the UserGrid, the component which the user's ships
        are placed upon
    */
    handleRenderGrid = () => {
        //setting the rows and columns of the gameboard grid
        let y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        //map over the letters and for each letter return a 'column' div.
        //each 'column' div will have a style of 'display:inline-block' so that the
        // columns will align on the grid.
        return y.map((num, index) => {
            return (
                <div key={index} className='column'>
                    {/* These cells will be the top row of the grid and will have a letter for each cell*/}
                    <Cell id={num} label={true} />
                    {x.map((letter, index) => {
                        if (num === 0) {
                            // these cells will be the most left coulumn and will have the numbers listed in each cell.
                            return <Cell key={letter} id={letter} label={true} />
                        }
                        return <Cell key={letter + num}
                            id={letter + num}
                            idNumber={this.findMyIndex(letter, num)}
                            x={num}
                            y={letter}
                            handleSelectTarget={this.handleSelectTarget}
                            selected={this.state.selected}
                            shipTiles={this.state.shipOccupied}
                            currentId={this.state.currentId}
                            allShipTiles={this.state.allShipTilesOccupied}
                            ref="c"
                            opponentShots={this.state.opponentShots}
                            playerShips={this.state.playerShips}
                            resumedGame={this.state.resumedGame}
                            opponentHits={this.state.opponentHits}
                            opponentMisses={this.state.opponentMisses}
                        />
                    })
                    }
                </div>
            )
        })
    };
    /*
        The following function closes socket listener when the component unmounts
    */
    componentWillUnmount(){
        if(this.props.socket){
            this.props.socket.close()
        }
    }


  render() {
    return (
      <div className='UserContainer grid'>
        <div className='UserGrid'>
          {this.handleRenderGrid()}
        </div>
        <span className='ErrorSpan'><p>{this.messageCreator()}</p></span>
        <h2>{this.handleSetShips()} </h2>
        {this.state.message && <p>{this.state.message}</p>}
      </div>
    )
  }

};

export default UserGrid;


