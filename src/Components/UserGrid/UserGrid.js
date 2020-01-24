import React from 'react';
import Cell from '../Cell/Cell';
import Button from '../Button/Button';
import './UserGrid.css';
import gameMovesApiService from '../../Services/game-moves-api-service';

class UserGrid extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: '',
            counter: this.props.resumedGame && this.props.userShips.length > 0 ? 5 : 0,
            playerShips: this.props.userShips && this.props.userShips.length !== 0 ? this.props.userShips : [{ 'name': 'aircraftCarrier', 'length': 5, 'spaces': [] },
            { 'name': 'battleship', 'length': 4, 'spaces': [] },
            { 'name': 'cruiser', 'length': 3, 'spaces': [] },
            { 'name': 'submarine', 'length': 3, 'spaces': [] },
            { 'name': 'defender', 'length': 2, 'spaces': [] }],
            alignment: 'horizontal',
            shipTileValues: this.props.shipTileValues,
            opponentShots: this.props.opponentShots,
            shipsReady: this.props.shipsReady,
            resumedGame: this.props.resumedGame,
            letterDropdown: '',
            numberDropdown: '',
            ghostShipTiles: [],
            message: null,
            mySunkShipTileValues: [],
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
        //the following code checks to see if the user has any of their own ships sunk
        let newValues = [...this.state.mySunkShipTileValues];
        this.state.playerShips.map(ship => {
            let counter = 0;
            let shipTileValues = [];
            if(this.state.opponentShots){
                this.state.opponentShots.map(shot => {
                if (ship.spaces.includes(shot)) {
                    counter++;
                    shipTileValues.push(shot);
                }
                return null;
            })
            }
            if (counter === ship.length) {
                newValues = [...newValues, ...shipTileValues]
            }
            return null;
        })
        this.setState({
            mySunkShipTileValues: newValues
        })

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
                                //the following code is utilized to update the state of userGrid to reflect that
                                //a user's ship has been sunk
                                let sunkenShip = this.state.playerShips.filter(ship => ship.name === data.ship);
                                let values = sunkenShip[0].spaces;
                                let newSunkValues = [...this.state.mySunkShipTileValues, ...values];
                                this.setState({
                                    mySunkShipTileValues: newSunkValues
                                })
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
    };


    setLetterSelectedFromDropDown = () => {
        var e = document.getElementById('letter-dropdown');
        var value = e.options[e.selectedIndex].value;

        if (value === '') {
            this.setState({
                letterDropdown: '',
                selected: null
            })
        }
        else if (this.state.numberDropdown) {

            if (!this.state.shipTileValues.includes(value + this.state.numberDropdown)) {
                this.setState({

                    letterDropdown: value,
                    selected: value + this.state.numberDropdown,
                }, () => this.updateGhostShip())
            }

        }
        else {
            this.setState({
                letterDropdown: value,
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
        }
        else if (this.state.letterDropdown) {

            if (!this.state.shipTileValues.includes(this.state.letterDropdown + value)) {
                this.setState({
                    numberDropdown: value,
                    selected: this.state.letterDropdown + value,

                }, () => this.updateGhostShip())
            }
        }
        else {
            this.setState({
                numberDropdown: value,
            })
        }
    }


    setBoat = (event) => {
        try {
            event.preventDefault();
            let valuesArray = this.makeShipTilesFromSelected();

            for (let i = 0; i < valuesArray.length; i++) {
                if (this.state.shipTileValues.includes(valuesArray[i])) {
                    throw new Error('Boat contains tiles occupied by another ship.');
                }
            }

            this.setState({
                shipTileValues: [...this.state.shipTileValues, ...valuesArray],
                ghostShipTiles: []

            }, () => this.handleCheckBoatLength(valuesArray));

        } catch (e) {
            let mess = `${e}`;

            this.setState({
                selected: '',
                letterDropdown: '',
                numberDropdown: '',
                
            }, () => this.props.setError({ error: mess }));
        }
    }


    switchAlignment = () => {
        let newAlignment = this.state.alignment === 'horizontal' ? 'vertical' : 'horizontal';
        this.setState({
            alignment: newAlignment
        })
    }


    updateGhostShip = () => {
        try {
            if (this.state.selected) {
                let valuesArray = this.makeShipTilesFromSelected();

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
                letterDropdown: '',
                numberDropdown: '',
                
            }, () => this.props.setError({ error: message }));
        }


    }

    makeShipTilesFromSelected = () => {
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        let numOfTiles = this.state.playerShips[this.state.counter].length;
        let valuesArray = [];

        let currentNum = parseInt(this.state.numberDropdown);
        let letterIndex = letters.indexOf(this.state.letterDropdown);

        for (let i = 0; i < numOfTiles; i++) {
            let alphaNumericString = '';
            if (currentNum > 10 || letterIndex > 9) {
                throw new Error('Ship out of bounds.');
            }

            if (this.state.alignment === 'horizontal') {
                alphaNumericString += this.state.letterDropdown;
                alphaNumericString += `${currentNum}`;

                currentNum++;
                valuesArray.push(alphaNumericString);
            } 
            else if (this.state.alignment === 'vertical') {
                alphaNumericString += letters[letterIndex];
                alphaNumericString += `${currentNum}`;

                letterIndex++;
                valuesArray.push(alphaNumericString);
            }
        }

        return valuesArray;
    }


    handleRenderDropDown = () => {
        let letters = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett'];
        let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

        return (
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

                <Button type='button' onClick={async () => {
                    await this.switchAlignment();
                    this.updateGhostShip();
                }}>{this.state.alignment === 'horizontal' ? 'Horizontal' : 'Vertical'}</Button>
                <Button type='submit'>Submit</Button>
            </form>
        );
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
            // sends ship placement data. 
            gameMovesApiService.setShips(this.state.playerShips, this.props.gameId, this.props.playerNum)
                .then(() => {
                    this.props.setShipsReady();
                    this.props.socket.emit('ships_ready', this.props.room);
                }) // In the event of an error setting ships, all data is reset
                .catch((e) => {
                    this.props.setError(e);
                    this.setState({
                        selected: '',
                        counter: 0,
                        playerShips: [{ 'name': 'aircraftCarrier', 'length': 5, 'spaces': [] },
                        { 'name': 'battleship', 'length': 4, 'spaces': [] },
                        { 'name': 'cruiser', 'length': 3, 'spaces': [] },
                        { 'name': 'submarine', 'length': 3, 'spaces': [] },
                        { 'name': 'defender', 'length': 2, 'spaces': [] }],
                        shipTileValues: [],
                        opponentShots: [],
                        shipsReady: false,
                    })
                }); 
        // Continue to set ship tiles until all boats are set
        } else if (this.state.counter <= 4) {
            return `Please select cells for ${this.state.playerShips[this.state.counter].name}.
            This ship is ${this.state.playerShips[this.state.counter].length} spaces long`

        } else return `Your Fleet is Ready for Battle...`
    };


    /*  
        The following function is used as a callback function after updating the boat values in state. The 
        function checks the boat length to see if the ship is complete, and sends it to the 'checkBoatValidity'
        function to be validated. If valid, 'playerShips' in state is updated, as well as the counter 
        indicating how many boats have been built

    */
    handleCheckBoatLength = (boatArray) => {
        if (boatArray.length === this.state.playerShips[this.state.counter].length) {
        
            let currentShips = [...this.state.playerShips];
            currentShips[this.state.counter].spaces = boatArray;
            // Sets 'playerShips' in state to newly updated current ship values, increases counter.
            this.setState({
                playerShips: currentShips,
                counter: this.state.counter + 1,
                numberDropdown: '',
                letterDropdown: '',
                selected: '',
            });
        }
    };


    /*
        Passed as a callback to the cell component, the following function checks to see whether any cell
        can be selected, by checking to see if all ships have been placed on the UserGrid. Sets the cell as
        the currently selected cell
    */
    handleSelectTarget = (value) => {
        if (this.props.error) {
            this.props.clearError();
        }
        if (!this.state.shipsReady) {

            if (!this.state.shipTileValues.includes(value)) {
                this.setState({
                    selected: value,
                    letterDropdown: value.charAt(0),
                    numberDropdown: value.slice(1),

                }, () => this.updateGhostShip())
            }
            else {
                this.setState({
                    selected: '',
                    letterDropdown: '',
                    numberDropdown: '',
                })
            }
        };
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
                            handleSelectTarget={this.handleSelectTarget}
                            shipTileValues={this.state.shipTileValues}
                            opponentShots={this.state.opponentShots}
                            mySunkShipTileValues={this.state.mySunkShipTileValues}
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
    };

    render() {
        let shipSetForm = this.props.shipsReady ? null : this.handleRenderDropDown();
        return (
            <div className='UserContainer grid'>
                <h2>Your Ships</h2>
                <div className='UserGrid gameGrid'>
                    {shipSetForm}
                    {this.handleRenderGrid()}
                </div>
                {!this.state.message && <h2>{this.handleSetShips()} </h2>}
                {this.state.message && <p aria-live='assertive'>{this.state.message}</p>}
            </div>
        )
    }

};

export default UserGrid;


