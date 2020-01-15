import React from 'react';
import UserGrid from '../UserGrid/UserGrid';
import io from 'socket.io-client';
import config from '../../config';
import { BrowserRouter as Link } from "react-router-dom";
import OpponentGrid from '../OpponentGrid/OpponentGrid';
import './GameBoard.css';
import TokenService from '../../Services/token-service';
import Chat from '../Chat/Chat';

class GameBoard extends React.Component {
  state = {
    userShips: this.props.gameData.userShips,
    userHits: this.props.gameData.userHits,
    userMisses: this.props.gameData.userMisses,
    opponentShots: [...this.props.gameData.opponentHits, ...this.props.gameData.opponentMisses],
    userTurn: this.props.gameData.turn,
    gameId: this.props.gameData.gameId,
    playerNum: this.props.gameData.currentUser,
    room: this.props.gameData.room_id,
    resumedGame: this.props.gameData.resumedGame,
    opponentShipsReady: this.props.gameData.opponentShips,
    shipsReady: this.props.gameData.shipsReady,
    shipTileValues: this.props.gameData.shipTileValues,
    socket: null,
    error: null,
    winnerSet:false,
  }

  setError = (err) => {
    this.setState({
      error: err.error
    })
  }

  setShipsReady = () => {
    this.setState({
      shipsReady: true
    })
  }

  changeTurn = () => {
    this.setState({
      userTurn: !this.state.userTurn
    })
  }

  clearError = () => {
    this.setState({ error: null, })
  }

  componentDidMount = () => {
    const socket = io(config.API_ENDPOINT, {
      transportOptions: {
        polling: {
          extraHeaders: {
            'Authorization': `Bearer ${TokenService.getAuthToken()}`
          }
        }
      }
    });
    let roomName = this.state.room ? this.state.room : 'random';
    socket.emit('join_room', roomName);

    socket.on('joined', data => {
      this.setState({
        playerNum: data.player,
        room: data.room,
        userTurn: data.player === 'player1' ? true : false,
        gameId: data.gameId,
        socket: socket
      })
    });

    socket.on('reconnected', () => {
      this.setState({
        socket: socket
      })
    });

    socket.on('opponent_ready', () => {
      this.setState({
        opponentShipsReady: true
      })
    });


    socket.on('win', () => {
      this.setState({
        winnerSet:true
      })
    })
  }

  resultsDisplay=()=>{
    let player= this.state.playerNum;
    let room = this.state.gameId;
    if(this.state.winnerSet){
      return (
          <Link to= {{pathname:'/result', resultProps:{'player': player, 'game':room}}}>
              <button type='button'>
              See Your Results!
              </button>
          </Link>      
      )
    }else {
      return null;
    }
  }

  render() {
    //let gameStarted = (this.state.shipsReady && this.state.opponentShipsReady);
    let opponentGrid = (this.state.shipsReady && this.state.opponentShipsReady && this.state.socket)? 
      <OpponentGrid 
        socket={this.state.socket} room={this.state.room} hits={this.state.userHits} misses={this.state.userMisses} 
        changeTurn={this.changeTurn} userTurn = {this.state.userTurn} gameId={this.state.gameId} playerNum ={this.state.playerNum}
        gameStart={this.state.shipsReady && this.state.opponentShipsReady} /> 
      : <p> Waiting For Both Players to Set Their Ships ! </p>;
    return (
        <>
          {this.state.error && <p className='errorMessage'>Uh oh! Something went wrong: {this.state.error}</p>}
          <h2>Your Ships</h2>
      
          <div className='grid-box'>
            {this.state.socket && <UserGrid
              socket={this.state.socket} 
              userShips={this.state.userShips} 
              opponentShots={this.state.opponentShots} 
              resumedGame={this.state.resumedGame} 
              changeTurn={this.changeTurn}
              setShipsReady={this.setShipsReady} 
              room={this.state.room} 
              shipsReady={this.state.shipsReady}
              shipTileValues={this.state.shipTileValues}
              gameId={this.state.gameId}
              playerNum ={this.state.playerNum}
              error= {this.state.error}
              setError= {this.setError}
              clearError= {this.clearError} />}
            {opponentGrid}
          </div>
          {this.resultsDisplay()}  
          {this.state.socket && <Chat 
            socket={this.state.socket} 
            room={this.state.room}/>}
        </>
    )
  };
};

export default GameBoard;


