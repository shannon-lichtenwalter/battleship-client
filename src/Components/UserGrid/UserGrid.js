import React from 'react';
import Cell from '../Cell/Cell';
import './UserGrid.css'

class UserGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: '',
            message: null,
            boat: [],
            playerShips: [{ 'name': 'aircraftCarrier', 'length': 5, 'spaces': [] },
            { 'name': 'battleship', 'length': 4, 'spaces': [] },
            { 'name': 'cruiser', 'length': 3, 'spaces': [] },
            { 'name': 'submarine', 'length': 3, 'spaces': [] },
            { 'name': 'defender', 'length': 2, 'spaces': [] }]
        }
    }

    componentDidMount() {

    }

    handleSetShips = () => {
        if(this.state.playerShips[0].spaces.length ===0){
            return `Please select cells for ${this.state.playerShips[0].name}`
        }
    }

    handleCheckValue = (value, idNum) => {
        console.log(idNum);
        if(this.state.boat.length === 0){
            this.setState({
                boat: [{value, idNum}]
            })
        }
        else {
            let lastIdNum = this.state.boat[this.state.boat.length-1].idNum;
            console.log(lastIdNum)
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
                    this.setState({
                        boat:[...this.state.boat, {value, idNum}]
                    })
            }
        }


        }


    }

    handleSelectTarget = (value, idNum) => {
        this.handleCheckValue(value, idNum);
        this.setState({
            selected: value,
            //boat: [...this.state.boat, value],
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
            </div>

        )
    }
}

export default UserGrid;