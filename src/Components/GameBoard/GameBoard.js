import React from 'react';
import UserGrid from '../UserGrid/UserGrid';
import io from 'socket.io-client';
import config from '../../config';
import OpponentGrid from '../OpponentGrid/OpponentGrid';
import BattleShipContext from '../../Contexts/battleship-context';
import './GameBoard.css';
import TokenService from '../../Services/token-service';
import Chat from '../Chat/Chat';

class GameBoard extends React.Component {
  state = {
    userShips: this.props.gameData.userShips,
    userHits: this.props.gameData.userHits,
    userMisses: this.props.gameData.userMisses,
    opponentHits: this.props.gameData.opponentHits,
    opponentMisses: this.props.gameData.opponentMisses,
    opponentShots: [...this.props.gameData.opponentHits, ...this.props.gameData.opponentMisses],
    userTurn: this.props.gameData.turn,
    gameId: this.props.gameData.gameId,
    playerNum: this.props.gameData.currentUser,
    room: this.props.gameData.room_id,
    resumedGame: this.props.gameData.resumedGame,
    opponentShipsReady: this.props.gameData.opponentShips,
    shipsReady: this.props.gameData.shipsReady,
    socket: null,
    error: null
  }

  //can we move this to a separate context provider file?
  setError = (err) => {
    this.setState({
      error: err.error
    })
  }

  setShipsReady = () => {
    console.log('setting ships ready')
    this.setState({
      shipsReady: true
    })
  }

  changeTurn = () => {
    this.setState({
      userTurn: !this.state.userTurn
    })
  }

  // determineOpponentShots = () => {
  //   console.log(this.state.opponentHits);
  //   console.log(this.state.opponentMisses);

  //   if (this.state.opponentHits && this.state.opponentMisses) {
  //     return [...this.state.opponenetHits, ...this.state.opponenetMisses]
  //   } else if (this.state.opponentHits) {
  //     return this.state.opponentHits
  //   } else if (this.state.opponentMisses) {
  //     return this.state.opponenetMisses
  //   } else {
  //     return []
  //   }
  // }

  clearError = () => {
    this.setState({ error: null, })
  }

  componentDidMount = () => {
    //fetch game data based on game id. set the state with the game data and pass
    //down as props to userGrid (needs ships for the user and opponent hits) and opponentGrid
    //(needs user's hits and misses to re-mark the board)
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

    socket.on('win', data => {
      if (data.winner === this.state.playerNum) {
        alert('You won!')
      } else {
        alert('You lost')
      }
    })
  };

  render() {
    let opponentGrid = this.state.shipsReady && this.state.socket ?
      <OpponentGrid
        socket={this.state.socket} room={this.state.room} hits={this.state.userHits} misses={this.state.userMisses}
        changeTurn={this.changeTurn} userTurn={this.state.userTurn}
        gameStart={this.state.shipsReady && this.state.opponentShipsReady} />
      : null;

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
          <div className='grid-box'>
            {this.state.socket && <UserGrid
              socket={this.state.socket} userShips={this.state.userShips} opponentHits={this.state.opponentHits}
              opponentMisses={this.state.opponentMisses} resumedGame={this.state.resumedGame} changeTurn={this.changeTurn}
              setShipsReady={this.setShipsReady} room={this.state.room} shipsReady={this.state.shipsReady} />}
            {opponentGrid}
          </div>

          {this.state.socket && <Chat socket={this.state.socket} room={this.state.room} />}
        </>
      </BattleShipContext.Provider>
    )
  };
};

export default GameBoard;


