import React from 'react';
import loadGamesApiService from '../../Services/load-game-api-service';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './ActiveGameListItem.css';

class ActiveGameListItem extends React.Component {
  state = {
    game_status: this.props.game.game_status,
    gameId: this.props.game.id,
    player1: this.props.game.player1,
    player2: this.props.game.player2,
    room_id: this.props.game.room_id,
    turn: this.props.game.turn,
    player1_username: this.props.game.player1_username,
    player2_username: this.props.game.player2_username,
    userId: this.props.userId,
    currentUserPlayer: Number(this.props.userId) === Number(this.props.game.player1) ? 'player1' : 'player2'
  }

  determineTurn = () => {
    let currentUser;
    let opponent;
    if (this.state.currentUserPlayer === 'player1') {
      currentUser = 'player1'
      opponent = this.props.game.player2_username
    } else {
      currentUser = 'player2'
      opponent = this.props.game.player1_username
    }
    if (this.props.game.turn === currentUser) {
      return 'Your Turn!'
    } else {
      return `${opponent}'s turn`
    }
  }

  //This function retrieves all game data for an active game. It sets the state of App with the data
  //depending on if the current user is player1 or player2. Then it routes the user to the gameroom.
  handleResumeGame = () => {
    return loadGamesApiService.resumeActiveGame(this.props.game.id, this.state.currentUserPlayer)
      .then(res => {
        let gameData = res;
        let storeData = {};

        if (gameData.currentUser === 'player1') {
          storeData.userShips = gameData.player1_ships ? gameData.player1_ships : [];
          storeData.shipsReady = gameData.player1_ships ? true : false;
          storeData.userHits = gameData.player1_hits ? gameData.player1_hits : [];
          storeData.userMisses = gameData.player1_misses ? gameData.player1_misses : [];
          storeData.opponentHits = gameData.player2_hits ? gameData.player2_hits : [];
          storeData.opponentMisses = gameData.player2_misses ? gameData.player2_misses : [];
          storeData.opponentShips = gameData.player2_ships;
        } else {
          storeData.userShips = gameData.player2_ships ? gameData.player2_ships : [];
          storeData.shipsReady = gameData.player2_ships ? true : false;
          storeData.userHits = gameData.player2_hits ? gameData.player2_hits : [];
          storeData.userMisses = gameData.player2_misses ? gameData.player2_misses : [];
          storeData.opponentHits = gameData.player1_hits ? gameData.player1_hits : [];
          storeData.opponentMisses = gameData.player1_misses ? gameData.player1_misses : [];
          storeData.opponentShips = gameData.player1_ships;
        }
        storeData.currentUser = gameData.currentUser;
        storeData.turn = gameData.currentUser === gameData.turn;
        storeData.gameId = gameData.id;
        storeData.room_id = this.props.game.room_id;
        storeData.resumedGame = true;
        storeData.shipTileValues = [];
        storeData.userShips.map(ship => {
          if (ship.spaces) {
            storeData.shipTileValues = [...storeData.shipTileValues, ...ship.spaces]
          }
          return null;
        })
        this.props.setGameData(storeData)
      }).then(() => {
        setTimeout(() => {
          this.props.history.push('/gameroom')
        }, 50);
      })
      .catch((e) => this.props.setError(e));
  }


  render() {
    return (
      <div className='activeGameListItem'>
        <li>{this.state.player1_username} versus {this.state.player2_username}</li>
        <ul className='activeGameDetails'>
          <li>GameRoom: #{this.state.room_id}</li>
          <li>Turn: {this.state.userId && this.determineTurn()}</li>
          <li>
            <Button onClick={this.handleResumeGame}>
              Resume Game?
            </Button>
          </li>
        </ul>
      </div>
    )
  }
}

export default withRouter(ActiveGameListItem);


