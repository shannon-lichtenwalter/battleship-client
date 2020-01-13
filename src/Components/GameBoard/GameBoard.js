import React from 'react';
import UserGrid from '../UserGrid/UserGrid';
import io from 'socket.io-client';
import config from '../../config';
import OpponentGrid from '../OpponentGrid/OpponentGrid';
import BattleShipContext from '../../Contexts/battleship-context';
import './GameBoard.css';
import TokenService from '../../Services/token-service';




class GameBoard extends React.Component {

  /*
  
    export object = {
        hits
        misses
        our Ships
    };

    import object = {
        our hits 
        our misses
        opponents hits/misses
        our ships
        whose turn
    };
  */ 


  /*
  Add opponents hits/misses to state
  */
  state = {
    userShips: [],
    opponentShips: [],
    userHits: [],
    userMisses: [],
    opponentHits: [],
    opponentMisses: [],
    userTurn: false,
    //hard coding gameId and playerNum for testing purposes temporarily
    gameId: 1,
    playerNum: 'player1',
    error: null,
    room: this.props.room,
    socket: null
  }

  //can we move this to a separate context provider file?
  setError = (err) => {
    this.setState({
      error: err.error
    })
  }

  clearError = () => { 
    this.setState({ error: null, }) 
  }
  
  componentDidMount = () =>{
    //fetch game data based on game id. set the state with the game data and pass
    //down as props to userGrid (needs ships for the user and opponent hits) and opponentGrid
    //(needs user's hits and misses to re-mark the board)
    const socket = io(config.API_ENDPOINT, {
      transportOptions: {
        polling: {
          extraHeaders: {
            'Authorization' : `Bearer ${TokenService.getAuthToken()}`
          }
        }
      }
    });
    let roomName = this.state.room ? this.state.room: 'random';
    socket.emit('join_room', roomName);

    
    socket.on('joined', data =>  {
      console.log(data);
      this.setState({
        playerNum: data.player,
        room: data.room,
        userTurn: data.player === 'player1' ? true: false,
        gameId: data.gameId,
        socket: socket
      })
    });

    socket.on('reconnected', () => {
      this.setState({
        socket:socket
      })
    });
  }

  render () {
    return (
      <BattleShipContext.Provider value={{
        gameId: this.state.gameId,
        playerNum: this.state.playerNum,
        error: this.state.error,
        setError: this.setError,
        clearError: this.clearError
      }}>
      <>
      {this.state.error && <p className='errorMessage'>{this.state.error}</p>}
      <h2>Your Ships</h2>
      {this.state.socket && <UserGrid socket={this.state.socket} /> }

      <h2>Opponent Ships</h2>
      <OpponentGrid socket={this.state.socket} room={this.state.room}/>
      </>
      </BattleShipContext.Provider>
    )
  };
};

export default GameBoard;


