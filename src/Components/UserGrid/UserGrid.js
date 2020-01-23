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
            alignment: 'horizontal',
            shipTileLaid: false,
            opponentShots: this.props.opponentShots,
            shipsReady: this.props.shipsReady,
            placementFail: false,
            resumedGame: this.props.resumedGame,
            letterDropdown: '',
            numberDropdown: '',
            usingDropdown: false,
            usingMouse: true,
            tileSelectedFromDropdown: false,
            ghostShipTiles: []
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
    componentDidMount = () => {
        if (this.props.socket) {
            this.props.socket.on('response', data => {
                if (data) {

                    this.props.changeTurn();
                    let ship = null;
                    if (data.ship === 'aircraftCarrier') {
                        ship = 'Aircraft Carrier'
                    } else if (data.ship !== null) {
                        ship = data.ship.charAt(0).toUpperCase() + data.ship.slice(1)
                    }

                    if (this.props.playerNum !== data.playerNum) {
                        let message = null;
                        if (data.result === 'miss') {
                            message = `${this.props.opponentUsername} missed!`
                        } else {
                            if (data.sunk) {
                                message = `${this.props.opponentUsername} sunk your ${ship}!`
                            } else {
                                message = `${this.props.opponentUsername} ${data.result} your ${ship}`

                            }
                        }
                        this.setState({
                            message,
                            opponentShots: [...this.state.opponentShots, data.target]
                        })
                    }
                    if (!this.props.opponentShipsReady) {
                        this.props.setOpponentShipsReady();
                    }
                }
            })
        }
        //console.log(('A').charCodeAt(0))
        //console.log(('E').charCodeAt(0))
        if (this.state.tileSelectedFromDropdown) {
            this.setState({
                tileSelectedFromDropdown: false,
                usingDropdown: false
            })
        }
    };

    updateFirstShipTileState = (value, idNum) => {
        this.setState({
            boat: [{ value, idNum }],           // Array of boat object, set value and idNum of boat tile 
            shipOccupied: [idNum],              // Array containing index of each cell (tile) in current boat
            shipTileLaid: true,                 // Boolean, false if no ship tiles laid
            allShipTilesOccupied: [idNum],      // Array containing index of each ship tile in total
            shipTileValues: [value],            // Array containing alphanumeric cell indices of all ships
            placementFail: false,               // Boolean if boat placement failed
        }, () => this.handleCheckBoatLength())
    }

    updateFirstShipTileForOtherBoatsState = (value, idNum) => {
        this.setState({
            boat: [{ value, idNum }],
            shipOccupied: [idNum],
            allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
            shipTileValues: [...this.state.shipTileValues, value],
            placementFail: false,
        }, () => this.handleCheckBoatLength()) // Callback to see whether tile filled boat reqs
    }

    updateHorizontalShipTiles = (value, idNum) => {
        this.setState({
            boat: [...this.state.boat, { value, idNum }],
            shipOccupied: [...this.state.shipOccupied, idNum],
            currentShipAlignment: 'horizontal',
            allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
            shipTileValues: [...this.state.shipTileValues, value],
        }, () => this.handleCheckBoatLength())
    }

    updateVerticalShipTiles = (value, idNum) => {
        this.setState({
            boat: [...this.state.boat, { value, idNum }],
            shipOccupied: [...this.state.shipOccupied, idNum],
            currentShipAlignment: 'vertical',
            allShipTilesOccupied: [...this.state.allShipTilesOccupied, idNum],
            shipTileValues: [...this.state.shipTileValues, value]
        }, () => this.handleCheckBoatLength())
    }



    //function will set the state to reflect the target that the user has selected
    // handleSelectTargetOption = (value) => {
    //   this.setState({
    // letterDropdown: value.charAt(0),
    // numberDropdown: value.slice(1),
    //     selected: value,
    //     message: null,
    //   })
    // }

    setLetterSelectedFromDropDown = () => {
        var e = document.getElementById('letter-dropdown');
        var value = e.options[e.selectedIndex].value;

        if (value === '') {
            this.setState({
                letterDropdown: '',
                selected: null
            })
        } else if (this.state.numberDropdown) {
            let temp = this.findMyIndex(this.state.letterDropdown, parseInt(value))
            if (!this.state.allShipTilesOccupied.includes(temp)) { //&& !this.state.misses.includes(value + this.state.numberDropdown)){
                this.setState({
                    letterDropdown: value,
                    message: null,
                    selected: value + this.state.numberDropdown,
                    usingDropdown: true,
                    usingMouse: false
                }, () => this.updateGhostShip())
                //this.handleSelectTarget(temp2, temp)
            }
            // else {
            //     this.setState({
            //         letterDropdown: value,
            //         message: null,
            //         selected: null
            //     })
            // }
        }
        else {
            this.setState({
                letterDropdown: value,
                message: null,
            })
        }
    }

    setNumberSelectedFromDropDown = () => {
        var e = document.getElementById('number-dropdown');
        var value = e.options[e.selectedIndex].value;
        if (value === '') {
            this.setState({
                letterDropdown: '',
                numberDropdown: '',
                selected: null
            })
        } else if(this.state.letterDropdown) {
            let temp = this.findMyIndex(this.state.letterDropdown, parseInt(value))
            console.log(temp)
            //this.handleSelectTarget(temp2, temp)
            //this.updateFirstShipTileState(temp2, temp)
            if (!this.state.allShipTilesOccupied.includes(temp)) {
                this.setState({
                    message: null,
                    numberDropdown: value,
                    selected: this.state.letterDropdown + value,
                    usingDropdown: true,
                    usingMouse: false,
                    tileSelectedFromDropdown: true,
                }, () => this.updateGhostShip())
            }
            //this.handleSelectTarget(temp2, temp)
        } else {
            this.setState({
                numberDropdown: value,
                message: null,
            })
        }
        //let temp = this.findMyIndex(this.state.letterDropdown + value)
        //console.log('hello')
        //this.updateFirstShipTileState(this.state.selected, temp)
        
    }


    setBoat = (event) => {
        try {
            event.preventDefault();
            let { boatTiles, indicesArray, valuesArray } = this.makeShipTilesFromSelected();

            for (let i = 0; i < boatTiles.length; i++) {
                if (this.state.allShipTilesOccupied.includes(boatTiles[i].idNum)) {
                    throw new Error('Boat contains tiles occupied by another ship.');
                }
            }


            this.setState({
                allShipTilesOccupied: [...this.state.allShipTilesOccupied, ...indicesArray],
                shipTileValues: [...this.state.shipTileValues, ...valuesArray],
                boat: boatTiles,
                ghostShipTiles: []
            }, () => this.handleCheckBoatLength());

        } catch (e) {
            let mess = `${e}`;

            this.setState({
                boat: [],
                selected: '',
                currentId: '',
                currentShipAlignment: null,
                letterDropdown: '',
                numberDropdown: '',
                tileSelectedFromDropdown: false
            }, () => this.props.setError({ error: mess }));
        }
        //

    }

    // laySelectOptionTiles=(value, idNum)=>{
    //   if(this.state.allShipTilesOccupied === 0){
    //     this.updateFirstShipTileState(value, idNum)
    //   } else 
    //   if(this.state.boat.length === 0){
    //     this.updateFirstShipTileForOtherBoatsState(value, idNum)
    //   } else
    //   if(this.state.)
    // }

    switchAlignment = () => {
        let newAlignment = this.state.alignment === 'horizontal' ? 'vertical' : 'horizontal';
        this.setState({
            alignment: newAlignment
        })
    }

    updateGhostShip = () => {
        console.log('updateGhostShip')
        try {
            if (this.state.selected) {
                let { valuesArray } = this.makeShipTilesFromSelected();
    
                this.setState({
                    ghostShipTiles: valuesArray
                })
            }
            else {
                this.setState({
                    ghostShipTiles: []
                })
            }
        } catch (e) {
            let message = `${e}`;

            this.setState({
                ghostShipTiles: [],
                selected: '',
                currentId: '',
                currentShipAlignment: null,
                letterDropdown: '',
                numberDropdown: '',
                tileSelectedFromDropdown: false
            }, () => this.props.setError({ error: message }));
        }
        

    }

    makeShipTilesFromSelected = () => {
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        let numOfTiles = this.state.playerShips[this.state.counter].length;
        let currentNum = parseInt(this.state.numberDropdown);
        let letterIndex = letters.indexOf(this.state.letterDropdown);
        let boatTiles = [];
        let indicesArray = [];
        let valuesArray = [];

        for (let i = 0; i < numOfTiles; i++) {
            let alphaNumericString = '';
            if (currentNum > 10 || letterIndex > 9) {
                throw new Error('Ship out of bounds.');
            }

            if (this.state.alignment === 'horizontal') {
                alphaNumericString += this.state.letterDropdown;
                alphaNumericString += `${currentNum}`;
                let tileIndex = this.findMyIndex(this.state.letterDropdown, currentNum);

                currentNum++;
                indicesArray.push(tileIndex);
                valuesArray.push(alphaNumericString);
                boatTiles.push({
                    value: alphaNumericString,
                    idNum: tileIndex
                });
            } else if (this.state.alignment === 'vertical') {
                alphaNumericString += letters[letterIndex];
                alphaNumericString += `${currentNum}`;
                let tileIndex = this.findMyIndex(letters[letterIndex], currentNum);

                letterIndex++;
                indicesArray.push(tileIndex);
                valuesArray.push(alphaNumericString);
                boatTiles.push({
                    value: alphaNumericString,
                    idNum: tileIndex
                });
            }
        }

        return {
            boatTiles,
            indicesArray,
            valuesArray
        };
    }


    handleRenderDropDown = () => {
        let letters = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett'];
        let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        return (

            //changing alignment
            //change letter/number dropdown
            <form onSubmit={(e) => this.setBoat(e)} >

                <select value={this.state.letterDropdown} id='letter-dropdown' onChange={() => this.setLetterSelectedFromDropDown()}>
                    <option value={''}>Letter</option>
                    {letters.map((letter, index) => {
                        return <option key={index} value={letter.charAt(0)}>{letter}</option>
                    })}
                </select>

                <select value={this.state.numberDropdown} id='number-dropdown' onChange={() => this.setNumberSelectedFromDropDown()}>
                    <option value={''}>Number</option>
                    {numbers.map((number, index) => {
                        return <option key={index} value={number}>{number}</option>
                    })}
                </select>

                <button type='button' onClick={async () => {
                    await this.switchAlignment();
                    this.updateGhostShip();
                }}>{this.state.alignment === 'horizontal' ? 'Horizontal' : 'Vertical'}</button>
                <button type='submit'>Submit</button>
            </form>


            // <form>
            //     <fieldset>
            //         <legend>Set Ships</legend>
            //         <div>
            //             <label htmlFor='letter-dropdown'>Y Coordinate:</label>
            //             <select value={this.state.letterDropdown} id='letter-dropdown' onChange={() => this.setLetterSelectedFromDropDown()}>
            //                 <option value={''}>Letter</option>
            //                 {letters.map((letter, index) => {
            //                     let counter = 0;
            //                     if (this.state.usingDropdown) {
            //                         //let temp = this.findMyIndex(letter.charAt(0), parseInt(num))
            //                         //numbers.filter((num) => this.handleCheckValue(letter.charAt(0), num))
            //                         // numbers.map(num => {
            //                         //  let temp = this.findMyIndex(letter.charAt(0), parseInt(num))
            //                         //  if(this.state.allShipTilesOccupied.length>0){
            //                         //     if (this.state.allshipTilesOccupied.indexOf(temp) === -1){// || this.state.misses.includes(letter.charAt(0) + num)){
            //                         //       counter++
            //                         //     }
            //                         //     return null
            //                         //   }
            //                         // })
            //                         if (this.state.boat.length > 0) {
            //                             let temp3 = this.state.boat[0].value
            //                             temp3 = temp3.slice(0, 1)
            //                             let temp4 = letter.charCodeAt(0)
            //                             let temp5 = temp3.charCodeAt(0)
            //                             console.log(temp4)
            //                             console.log(temp5)

            //                             if (this.state.counter === 0 && (Math.abs(temp4 - temp5) < 5)) {
            //                                 if (this.state.boat.length >= 2) {
            //                                     if (this.state.currentShipAlignment === 'horizontal' && ((Math.abs(temp4 - temp5)) === 0)) {
            //                                         return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                     } //else {
            //                                     //return <option key ={index} value={letter.charAt(0)}>{letter}</option>
            //                                     //}
            //                                 } else {
            //                                     return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                 }
            //                             } else
            //                                 if (this.state.counter === 1 && (Math.abs(temp4 - temp5) < 4)) {
            //                                     if (this.state.boat.length >= 2) {
            //                                         if (this.state.currentShipAlignment === 'horizontal' && ((Math.abs(temp4 - temp5)) === 0)) {
            //                                             return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                         } else {
            //                                             return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                         }
            //                                     } else {
            //                                         return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                     }
            //                                 } else
            //                                     if ((this.state.counter === 2 || this.state.counter === 3) && Math.abs(temp4 - temp5) < 3) {
            //                                         if (this.state.boat.length >= 2) {
            //                                             if (this.state.currentShipAlignment === 'horizontal' && ((Math.abs(temp4 - temp5)) === 0)) {
            //                                                 return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                             } else {
            //                                                 return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                             }
            //                                         } else {
            //                                             return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                         }
            //                                     } else
            //                                         if (this.state.counter === 4 && (Math.abs(temp4 - temp5) < 2)) {
            //                                             if (this.state.boat.length >= 2) {
            //                                                 if (this.state.currentShipAlignment === 'horizontal' && ((Math.abs(temp4 - temp5)) === 0)) {
            //                                                     return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                                 } else {
            //                                                     return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                                 }
            //                                             } else {
            //                                                 return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                                             }
            //                                         }

            //                         } //else {
            //                         //return <option key ={index} value={letter.charAt(0)}>{letter}</option>
            //                         //}
            //                         //if(counter < 10){
            //                         //    return <option key={index} value={letter.charAt(0)}>{letter}</option>
            //                         //}
            //                         //return null
            //                     } else return <option key={index} value={letter.charAt(0)}>{letter}</option>

            //                 })}
            //             </select>
            //         </div>
            //         <div>
            //             <label htmlFor='number-dropdown'>X Coordinate:</label>
            //             <select value={this.state.numberDropdown} id='number-dropdown' onChange={() => this.setNumberSelectedFromDropDown()}>
            //                 <option value={''}>Number</option>
            //                 {this.state.letterDropdown && numbers.map((value, index) => {
            //                     let temp = this.findMyIndex(this.state.letterDropdown, parseInt(value))
            //                     let temp2 = this.state.letterDropdown + value

            //                     if (this.state.allShipTilesOccupied.length > 0) {
            //                         if (this.state.allShipTilesOccupied.indexOf(temp) === (-1)) {
            //                             if (this.state.boat.length > 0) {
            //                                 let temp3 = this.state.boat[0].value
            //                                 temp3 = temp3.slice(1)
            //                                 console.log(temp3)
            //                                 console.log(index)
            //                                 if (this.state.counter === 0 && Math.abs(value - temp3) < 5) {
            //                                     if (this.state.boat.length >= 2) {
            //                                         if (this.state.currentShipAlignment === 'vertical' && ((parseInt(index) + 1) === temp3)) {
            //                                             return <option key={index} value={value}>{value}</option>
            //                                         } else {
            //                                             return <option key={index} value={value}>{value}</option>
            //                                         }
            //                                     } else {
            //                                         return <option key={index} value={value}>{value}</option>
            //                                     }
            //                                 } else
            //                                     if (this.state.counter === 1 && Math.abs(value - temp3) < 4) {
            //                                         return <option key={index} value={value}>{value}</option>
            //                                     } else
            //                                         if ((this.state.counter === 2 || this.state.counter === 3) && Math.abs(value - temp3) < 3) {
            //                                             return <option key={index} value={value}>{value}</option>
            //                                         } else
            //                                             if (this.state.counter === 4 && Math.abs(value - temp3) < 2) {
            //                                                 return <option key={index} value={value}>{value}</option>
            //                                             }
            //                             } else
            //                                 return <option key={index} value={value}>{value}</option>
            //                         }
            //                     }
            //                     else {
            //                         return <option key={index} value={value}>{value}</option>
            //                     }
            //                 })//.filter((value, index) => {
            //                     //let temp = this.findMyIndex(this.state.letterDropdown, parseInt(value))
            //                     //let temp2 = this.state.letterDropdown+value
            //                     //if(this.handleCheckValue(temp2, temp)){
            //                     //  return <option key ={index} value={value}>{value}</option>
            //                     //}
            //                     //})
            //                 }
            //                 {/* {this.state.letterDropdown && numbers.map((value, index) => {
            //         let temp = this.findMyIndex(this.state.letterDropdown, parseInt(value))
            //         let temp2 = this.state.letterDropdown+value
            //         console.log(temp2)
            //         if(this.state.allShipTilesOccupied.length > 0){
            //           if(this.state.allShipTilesOccupied.indexOf(temp)===(-1)){//} && !this.state.misses.includes(this.state.letterDropdown + value)){
            //               if(this.handleCheckValue((this.state.letterDropdown+value),temp) === true){
            //                 return <option key ={index} value={value}>{value}</option>
            //               }
            //           }
            //           //return null;
            //         } else {
            //           return <option key ={index} value={value}>{value}</option>
            //         }
            //       })} */}
            //             </select>
            //         </div>
            //         <h4>You have selected: {this.state.selected}</h4>
            //     </fieldset>
            // </form>
        )
    }

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
            gameMovesApiService.setShips(this.state.playerShips, this.props.gameId, this.props.playerNum)
                .then(() => {
                    this.props.setShipsReady();
                    this.props.socket.emit('ships_ready', this.props.room);
                }) // In the event of an error setting ships, all data is reset
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
        let temp = [];
        let temp2 = [];
        let temp3 = [];
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

            temp3 = this.state.shipTileValues
            temp3.splice(-temp.length, temp.length)
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
                    numberDropdown: '',
                    letterDropdown: '',
                    selected: '',
                    usingDropdown: false,
                    currentId: ''
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
                    if (!this.state.usingDropdown) {
                        this.updateFirstShipTileState(value, idNum)
                    } else {
                        if (this.state.tileSelectedFromDropdown) {
                            this.updateFirstShipTileState(value, idNum)
                        }
                        return true
                    }
                }
                // setState for the first tile of each subsequent ship 
                else if ((this.state.boat.length === 0 && this.state.shipTileLaid === true) && (this.state.allShipTilesOccupied.indexOf(idNum) === (-1))) {
                    if (!this.state.usingDropdown) {
                        this.updateFirstShipTileForOtherBoatsState(value, idNum)
                    } else {
                        if (this.state.tileSelectedFromDropdown) {
                            this.updateFirstShipTileForOtherBoatsState(value, idNum)
                        }
                        return true
                    }
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
                                if (!this.state.usingDropdown) {
                                    this.updateHorizontalShipTiles(value, idNum)
                                } else {
                                    if (this.state.tileSelectedFromDropdown) {
                                        this.updateHorizontalShipTiles(value, idNum)
                                    }
                                    return true
                                }
                            }
                        } else // If the cell selected is two cells away from the boat origin
                            if ((lastIdNum === firstIdNum + 2 || lastIdNum === firstIdNum - 2) &&
                                this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                                (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
                                (this.state.playerShips[this.state.counter].length > 2) &&
                                (this.state.currentShipAlignment !== 'vertical')) {
                                if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                                    if (!this.state.usingDropdown) {
                                        this.updateHorizontalShipTiles(value, idNum)
                                    } else {
                                        if (this.state.tileSelectedFromDropdown) {
                                            this.updateHorizontalShipTiles(value, idNum)
                                        }
                                        return true
                                    }
                                }
                            } else // If the cell selected is 3 cells away from the boat origin
                                if ((lastIdNum === firstIdNum + 3 || lastIdNum === firstIdNum - 3) &&
                                    this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                                    (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
                                    (this.state.playerShips[this.state.counter].length > 3) &&
                                    (this.state.currentShipAlignment !== 'vertical')) {
                                    if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                                        if (!this.state.usingDropdown) {
                                            this.updateHorizontalShipTiles(value, idNum)
                                        } else {
                                            if (this.state.tileSelectedFromDropdown) {
                                                this.updateHorizontalShipTiles(value, idNum)
                                            }
                                            return true
                                        }
                                    }
                                } else // If the cell selectedis 4 cells away from the boat origin
                                    if ((lastIdNum === firstIdNum + 4 || lastIdNum === firstIdNum - 4) &&
                                        this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                                        (Math.max(...this.state.shipOccupied) - lastIdNum < 5) &&
                                        (this.state.playerShips[this.state.counter].length > 4) &&
                                        (this.state.currentShipAlignment !== 'vertical')) {
                                        if (firstCurrentDigit.charAt(0) === firstDigit.charAt(0)) {
                                            if (!this.state.usingDropdown) {
                                                this.updateHorizontalShipTiles(value, idNum)
                                            } else {
                                                if (this.state.tileSelectedFromDropdown) {
                                                    this.updateHorizontalShipTiles(value, idNum)
                                                }
                                                return true
                                            }
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
                            if (!this.state.usingDropdown) {
                                this.updateVerticalShipTiles(value, idNum)
                            } else {
                                if (this.state.tileSelectedFromDropdown) {
                                    this.updateVerticalShipTiles(value, idNum)
                                }
                                return true
                            }
                        } else // If two cells above, or below boat origin
                            if ((lastIdNum === firstIdNum + 20 || lastIdNum === firstIdNum - 20) &&
                                this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                                (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
                                (this.state.playerShips[this.state.counter].length > 2) &&
                                (this.state.currentShipAlignment !== 'horizontal')) {
                                if (!this.state.usingDropdown) {
                                    this.updateVerticalShipTiles(value, idNum)
                                } else {
                                    if (this.state.tileSelectedFromDropdown) {
                                        this.updateVerticalShipTiles(value, idNum)
                                    }
                                    return true
                                }
                            } else // If three cells above, or below boat origin
                                if ((lastIdNum === firstIdNum + 30 || lastIdNum === firstIdNum - 30) &&
                                    this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                                    (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
                                    (this.state.playerShips[this.state.counter].length > 3) &&
                                    (this.state.currentShipAlignment !== 'horizontal')) {
                                    if (!this.state.usingDropdown) {
                                        this.updateVerticalShipTiles(value, idNum)
                                    } else {
                                        if (this.state.tileSelectedFromDropdown) {
                                            this.updateVerticalShipTiles(value, idNum)
                                        }
                                        return true
                                    }
                                } else // If four cells above, or below boat origin
                                    if ((lastIdNum === firstIdNum + 40 || lastIdNum === firstIdNum - 40) &&
                                        this.state.allShipTilesOccupied.indexOf(lastIdNum) === (-1) &&
                                        (Math.max(...this.state.shipOccupied) - lastIdNum < 50) &&
                                        (this.state.playerShips[this.state.counter].length > 4) &&
                                        (this.state.currentShipAlignment !== 'horizontal')) {
                                        if (!this.state.usingDropdown) {
                                            this.updateVerticalShipTiles(value, idNum)
                                        } else {
                                            if (this.state.tileSelectedFromDropdown) {
                                                this.updateVerticalShipTiles(value, idNum)
                                            }
                                            return true
                                        }
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
        if (this.props.error) {
            this.props.clearError();
        }
        if (!this.state.shipsReady) {
            //this.handleCheckValue(value, idNum);

            if (!this.state.allShipTilesOccupied.includes(value)) {
                this.setState({
                    selected: value,
                    message: null,
                    currentId: idNum,
                    letterDropdown: value.charAt(0),
                    numberDropdown: value.slice(1),
                }, () => this.updateGhostShip())
            }
            // else {
            //     this.setState({
            //         selected: value,
            //         message: null,
            //         currentId: idNum,
            //     })
            // }
        };
    }

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
        }
    }

    handleClearBoat = () => {
        let temp = this.state.boat
        let temp2 = this.state.allShipTilesOccupied
        temp2.splice(-temp.length, temp.length)
        let temp3 = this.state.shipTileValues
        temp3.splice(-temp.length, temp.length)
        this.setState({
            boat: [],
            currentShipAlignment: null,
            shipOccupied: [],
            selected: '',
            currentId: '',
            letterDropdown: '',
            numberDropdown: '',
            usingDropdown: false,
        })
    }


    /*
        Function called from render to display the UserGrid, the component which the user's ships
        are placed upon
    */
    //handleRenderGrid instantiates the rows and columns of the gameboard grid with the x and y variables.
    //it maps over the letters (x) and for each letter returns a 'column' div. When mapping we account for the top 
    //row of the grid being the letters and the far left column being the number labels. 
    handleRenderGrid = () => {
        let y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        return y.map((num, index) => {
            return (
                <div key={index} className='column' aria-hidden="true">
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
                            //allShipTiles={this.state.allShipTilesOccupied}
                            shipTileValues={this.state.shipTileValues}
                            opponentShots={this.state.opponentShots}
                            ghostShip={this.state.ghostShipTiles}
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
    componentWillUnmount() {
        if (this.props.socket) {
            this.props.socket.close()
        }
    }


    render() {
        let shipSetForm = this.props.shipsReady ? null: this.handleRenderDropDown();
        return (
            <div className='UserContainer grid'>
                <div className='UserGrid'>
                    {shipSetForm}
                    {this.handleRenderGrid()}
                </div>
                <span className='ErrorSpan'>
                    <p>{this.messageCreator()}</p>
                </span>
                <h2>{this.handleSetShips()} </h2>
                {this.state.message && <p aria-live='assertive'>{this.state.message}</p>}
            </div>
        )
    }

};

export default UserGrid;


