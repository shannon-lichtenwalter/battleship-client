import React, { Fragment } from 'react';
import loadGamesApiService from '../../Services/load-game-api-service';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import './ActiveGameListItem.css';

class ActiveGameListItem extends React.Component {
  state = {
    quitting: false,
    error: null,
  }

  determineTurn = () => {
    let currentUser= Number(this.props.userId) === Number(this.props.game.player1) ? 'player1' : 'player2'
    let opponent;
    if (currentUser === 'player1') {
      currentUser = 'player1'
      opponent = this.props.game.player2_username
    } else {
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
    return loadGamesApiService.resumeActiveGame(this.props.game.id)
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
          storeData.playerUsername = this.props.game.player1_username;
          storeData.opponentUsername = this.props.game.player2_username
        } else {
          storeData.userShips = gameData.player2_ships ? gameData.player2_ships : [];
          storeData.shipsReady = gameData.player2_ships ? true : false;
          storeData.userHits = gameData.player2_hits ? gameData.player2_hits : [];
          storeData.userMisses = gameData.player2_misses ? gameData.player2_misses : [];
          storeData.opponentHits = gameData.player1_hits ? gameData.player1_hits : [];
          storeData.opponentMisses = gameData.player1_misses ? gameData.player1_misses : [];
          storeData.opponentShips = gameData.player1_ships;
          storeData.playerUsername = this.props.game.player2_username;
          storeData.opponentUsername = this.props.game.player1_username
        }
        storeData.currentUser = gameData.currentUser;
        storeData.turn = gameData.currentUser === gameData.turn;
        storeData.gameId = gameData.id;
        storeData.room_id = this.props.game.room_id;
        storeData.resumedGame = true;
        storeData.shipTileValues = [];
        storeData.shipsCounter = gameData.shipsCounter;
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
      .catch((e) => this.setState({error:e.error}));
  }

  //handleQuitGame will make a PATCH call to the server to update
  // that the game has been forfeited and that the user who submitted the
  //forfeit request will be counted as the loser
  handleQuitGame = () => {
    let gameId = this.props.game.id;

    loadGamesApiService.quitActiveGame(gameId).then(res =>{
      this.setState({
        quitting:false
      })
      this.props.deletingActiveGame(gameId);
      
    })
    .catch((e) => {
      this.setState({
        quitting:false,
        error: e.error
      })
    });
  }

  render() {
    return (
      <Fragment>
        <div className={this.props.index === 0 ? '' : 'line'}></div>
        <li>{this.props.game.player1_username} versus {this.props.game.player2_username}</li>
        <li className='activeGameListItem'>
          <ul className='activeGameDetails'>
            <li>Turn: {this.props.userId && this.determineTurn()}</li>
            <li>
              <Button onClick={this.handleResumeGame}>
                Resume Game?
              </Button>
              {!this.props.game.player2 
                ? <Button className='disabledButton' type='button' disabled>Awaiting opponent...</Button>
                : <Button onClick={()=> this.setState({quitting:true})}>
                  Quit Game?
                </Button>}
              {this.state.quitting && 
              <div className='quittingOptions'>
                <h4>Are you sure you want to quit?</h4>
                <p>Your opponent will be marked as the winner and you will be marked as having lost the game.</p>
                <Button className='quitGameButton' onClick = {() => this.handleQuitGame()}>Quit Game Now</Button>
                <Button className='keepGameActive' onClick = {()=> this.setState({quitting:false})}>Keep Game Active</Button>
              </div> }
              {this.state.error && <p>{this.state.error}. Please refresh page.</p>}
            </li>
          </ul>
        </li>
        
      </Fragment>
    )
  }
}

export default withRouter(ActiveGameListItem);


