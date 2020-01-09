import React from 'react';
import Cell from '../Cell/Cell';
import './UserGrid.css';
import gameMovesApiService from '../../game-moves-api-service';
import BattleShipContext from '../../Contexts/battleship-context';

class UserGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: '',
            message: null,
            boat: [],
            counter: 0,
            playerShips: [{ 'name': 'Aircraft Carrier', 'length': 5, 'spaces': [] },
            { 'name': 'Battleship', 'length': 4, 'spaces': [] },
            { 'name': 'Cruiser', 'length': 3, 'spaces': [] },
            { 'name': 'Submarine', 'length': 3, 'spaces': [] },
            { 'name': 'Defender', 'length': 2, 'spaces': [] }]
        }
    }

    static contextType = BattleShipContext;

    componentDidMount() {

    }

    //This function is called by the render. It will look at the counter value to determine
    // if the user still needs to set their ship locations or if all the ship values have been set.
    //counter was added to state in order to access the different ships, counter is incremeneted in a later function
    //after a boat has been completely built. If all the boats have been build, then an API call is made to update the
    //player's ships location in the database.

    handleSetShips = () => {
        if(this.state.counter > 4){
            //once all the ships are set, the data is sent to the database to be stored
            gameMovesApiService.setShips(this.state.playerShips, this.context.gameId, this.context.playerNum)
            .catch((e) => this.context.setError(e));
            return `All Ships Have Been Set`
        } else {
            return `Please select cells for ${this.state.playerShips[this.state.counter].name}.
        This ship is ${this.state.playerShips[this.state.counter].length} spaces long`
        }
        
    }

    //This function is called by render simply as a visual tool for the user to see which cells they have selected so far
    //for the respective boats. We may not need this later on, but is helpful to see which cells are representing the boat so far.
    displayBoats = () => {
        return this.state.playerShips.map((ship, index) => {
            return <li key={index}>{ship.name} : {ship.spaces.length !== 0 ? ship.spaces.join(', ') : 'ship not built yet'}</li>
        })
    }

    //this function is used as a callback function after updating the boat values in state. this will allow us to check and see if the
    //boat is finished being built. if so it will update the playerShips in state with the values. It will also reset the boat back to empty and will 
    //increment the counter in order to move on to the next boat to build.
    handleCheckBoatLength = () => {
        if(this.state.boat.length === this.state.playerShips[this.state.counter].length){
            let currentShips = this.state.playerShips;
            let boatValues = this.state.boat.map(boat => boat.value);
            console.log(boatValues);
            currentShips[this.state.counter].spaces = boatValues
            this.setState({
                playerShips: currentShips,
                counter: this.state.counter + 1,
                boat: [],
            })
        } 
    }

    //this will be replaced by Sean's logic that he is building.

    handleCheckValue = (value, idNum) => {
        if(this.state.boat.length === 0){
            this.setState({
                boat: [{value, idNum}]
            })
        }
        else {
            let lastIdNum = this.state.boat[this.state.boat.length-1].idNum;
            if(lastIdNum % 10 === 0 && idNum === lastIdNum + 1){
                return
            }
            if((lastIdNum - 1) % 10 === 0 && idNum === lastIdNum -1 ){
                return
            }

            if(this.state.boat.length === 1) {
                if (lastIdNum + 1 === idNum 
                || lastIdNum -1 === idNum 
                || lastIdNum + 10 === idNum 
                || lastIdNum -10 === idNum){
                    //After setting state with a new boat value we have a callback function that checks the length of the
                    // boat that is currently being built and compares it to what the length of that model boat should be to determine if the boat is fully built yet
                    this.setState({
                        boat:[...this.state.boat, {value, idNum}]
                    }, () => this.handleCheckBoatLength())
            }
            } else {
            //this logic in the else statement is incorrect and not functional for building the boats. This is just to test the setting ships
            //functionality. After setting state with a new boat value we have a callback function that checks the length of the
            // boat that is currently being built and compares it to what the length of that model boat should be to determine if the boat is fully built yet
            this.setState({
                boat:[...this.state.boat, {value, idNum}]
            }, () => this.handleCheckBoatLength())
            }
        }
    }

    handleSelectTarget = (value, idNum) => {
        this.handleCheckValue(value, idNum); 
        this.setState({
            selected: value,
            message: null,
        })
    }

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
        }
        return temp
    }

    handleRenderGrid = () => {
        let counter = 0;
        //setting the rows and columns of the gameboard grid
        let y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        //map over the letters and for each letter return a 'column' div.
        //each 'column' div will have a style of 'display:inline-block' so that the
        // columns will align on the grid.
        return y.map((num, index) => {
            //counter++
            return (
                <div key={index} className='column'>
                    {/* These cells will be the top row of the grid and will have a letter for each cell*/}
                    <Cell id={num} label={true} />
                    {x.map((letter, index) => {
                        if (num === 0) {
                            // these cells will be the most left coulumn and will have the numbers listed in each cell.
                            return <Cell key={letter} id={letter} label={true} />
                        }
                        counter++
                        return <Cell key={letter + num}
                            id={letter + num}
                            idNumber={this.findMyIndex(letter, num)}
                            x={num}
                            y={letter}
                            handleSelectTarget={this.handleSelectTarget}
                            selected={this.state.selected}
                        //hits={this.state.hits}
                        //misses={this.state.misses}
                        />
                    })
                    }
                </div>
            )
        })
    }

    render() {

        return (
            <div className='UserContainer'>
                <div className='UserGrid'>
                    {this.handleRenderGrid()}
                </div>
                <h2>{this.handleSetShips()} </h2>
                <h3>{this.displayBoats()}</h3>
            </div>

        )
    }
}

export default UserGrid;