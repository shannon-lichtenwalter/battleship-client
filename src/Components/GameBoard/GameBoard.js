import React from 'react';
import Button from '../Button/Button';
import UserGrid from '../UserGrid/UserGrid';
import io from 'socket.io-client';
import config from '../../config';
import { withRouter } from "react-router-dom";
import OpponentGrid from '../OpponentGrid/OpponentGrid';
import './GameBoard.css';
import TokenService from '../../Services/token-service';
import Chat from '../Chat/Chat';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

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
    playerUsername: this.props.gameData.playerUsername,
    opponentUsername: this.props.gameData.opponentUsername,
    shipsCounter: this.props.gameData.shipsCounter,
    socket: null,
    error: null,
    winnerSet: false,
    whoWon: null
  }

  updateShipsCounter = (shipName, target, sunk) => {
    let shipsCounter = {...this.state.shipsCounter};
    shipsCounter[shipName].hit = shipsCounter[shipName].hit + 1;
    shipsCounter[shipName].spaces = [...shipsCounter[shipName].spaces, target]
    if(sunk){
      shipsCounter[shipName].sunk = true;
    }
    this.setState({
      shipsCounter
    })
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

  setOpponentShipsReady = () => {
    this.setState({
      opponentShipsReady: true
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
    window.scrollTo(0, 0);
    document.title = 'Gameboard'
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

<<<<<<< HEAD
    socket.on('win', () => {
=======

    socket.on('win', (data) => {
>>>>>>> master
      this.setState({
        winnerSet: true,
        whoWon: data.winner
      })
    });

    socket.on('usernames', (data) => {
      this.setState({
        playerUsername: data.usernames.player,
        opponentUsername: data.usernames.opponent
      })
    });

    socket.on('error-message', (e) => {
      this.setState({
        error: e.error
      })
    });

    socket.on('closed', () => {
      this.setState({
        error: 'You have idled for too long, please navigate back to this match from dashboard if you wish to continue.'
      })
    });
    
  }

  

  handleResults = () => {
    let player = this.state.playerNum;
    let gameId = this.state.gameId;
    let playerWinBool = this.state.whoWon === this.state.playerNum ? true : false;

<<<<<<< HEAD
    this.props.setResults(player, 2, 'my username', 'my opponents username');
    // this.props.setResults(player, gameId, this.state.playerUsername, this.state.opponentUsername);
=======
    // this.props.setResults(player, 2, 'my username', 'my opponents username');
    this.props.setResults(player, gameId, this.state.playerUsername, this.state.opponentUsername, playerWinBool);
>>>>>>> master
    this.props.history.push('/result');
  }

  render() {

    let errorMessage = this.state.error
      ? <p className='errorMessage'>Uh oh! Something went wrong: {this.state.error}</p>
      : null;

    let versusHeader = this.state.playerUsername && this.state.opponentUsername
      ? <h2>{this.state.playerUsername + ' versus ' + this.state.opponentUsername}</h2>
      : <h2>Waiting for Opponent...</h2>;


    let userGrid = this.state.socket
      ? <UserGrid
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
        playerNum={this.state.playerNum}
        error={this.state.error}
        setError={this.setError}
        clearError={this.clearError}
        playerUsername={this.state.playerUsername}
        opponentUsername={this.state.opponentUsername}
        opponentShipsReady={this.state.opponentShipsReady}
        setOpponentShipsReady={this.setOpponentShipsReady}
      />
      : null;

    let opponentGrid = (this.state.shipsReady && this.state.opponentShipsReady && this.state.socket)
      ? <OpponentGrid
        socket={this.state.socket}
        room={this.state.room}
        hits={this.state.userHits}
        misses={this.state.userMisses}
        changeTurn={this.changeTurn}
        userTurn={this.state.userTurn}
        gameId={this.state.gameId}
        playerNum={this.state.playerNum}
        gameStart={this.state.shipsReady && this.state.opponentShipsReady}
        playerUsername={this.state.playerUsername}
        opponentUsername={this.state.opponentUsername}
        winnerSet={this.state.winnerSet}
        shipsCounter={this.state.shipsCounter}
        updateShipsCounter={this.updateShipsCounter} />
      : null;


    let waitingOnOpponent = (this.state.shipsReady && !this.state.opponentShipsReady)
      ? <p> Waiting For Both Players to Set Their Ships ! </p> : null;

    let resultButton = this.state.winnerSet ?
      <Button onClick={() => this.handleResults()}>See Your Results !</Button>
      : null;

    let chat = this.state.socket
      ? <Chat
        socket={this.state.socket}
        room={this.state.room} />
      : null;

<<<<<<< HEAD
=======



>>>>>>> master
    return (
      <div className='gameroom'>
        <Header />
        {errorMessage}
        {!this.state.error && versusHeader}
        <div className='grid-box'>
          {userGrid}
          {opponentGrid}
        </div>
        {waitingOnOpponent}

        {resultButton}
        {chat}

        <Button onClick={() => this.props.history.push('/dashboard')}>Back</Button>
        <Footer />
      </div>
    )
  };
};

export default withRouter(GameBoard);


