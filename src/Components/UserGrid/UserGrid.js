import React from 'react';
import Cell from '../Cell/Cell';
import './UserGrid.css'

class UserGrid extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            selected: '',
            message: null,
            playerShips:[{'name':'aircraftCarrier', 'length':5, 'spaces':[]},
                         {'name':'battleship', 'length':4, 'spaces':[]},
                         {'name':'cruiser', 'length':3, 'spaces':[]},
                         {'name':'submarine', 'length':3, 'spaces':[]},
                         {'name':'defender', 'length':2, 'spaces':[]}]
        }
    }

    componentDidMount(){

    }


    handleSelectTarget = (value) => {
        this.setState({
          selected: value,
          message: null,
        })
      }

    handleRenderGrid = () => {
        let counter = 0;
        //setting the rows and columns of the gameboard grid
        let y= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let x = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        //map over the letters and for each letter return a 'column' div.
        //each 'column' div will have a style of 'display:inline-block' so that the
        // columns will align on the grid.
        return y.map((num, index) => {
            //counter++
          return (
          <div key= {index} className='column'> 
          {/* These cells will be the top row of the grid and will have a letter for each cell*/}
          <Cell id={num} label={true} />
            {x.map((letter, index) => {
              if(num === 0){
                // these cells will be the most left coulumn and will have the numbers listed in each cell.
                return <Cell key={letter} id={letter} label={true}/>
              }
              counter++
              return <Cell key={letter + num} 
                id={letter+num} 
                x={num} 
                y ={letter} 
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

    render(){

        return(
            <div className='UserContainer'>
                <div className='UserGrid'>
                    {this.handleRenderGrid()}
                </div>
                <h2>Please select the cells for your aircraft carrier: </h2>
            </div>

        )
    }
}

export default UserGrid;