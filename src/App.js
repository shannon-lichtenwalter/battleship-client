import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Help from './Components/Help/Help';
import Landing from './Components/Landing/Landing';
import Login from './Components/Login/Login';
import PrivateOnlyRoute from './Components/PrivateOnlyRoute/PrivateOnlyRoute';
import PublicOnlyRoute from './Components/PublicOnlyRoute/PublicOnlyRoute';
import Signup from './Components/Signup/Signup';
import Dashboard from './Components/Dashboard/Dashboard';
import GameHistory from './Components/GameHistory/GameHistory';
import GameBoard from './Components/GameBoard/GameBoard';
import Result from './Components/Result/Result';



import NotFoundRoute from './Routes/NotFoundRoute/NotFoundRoute';



export default class App extends Component {
  state = {
    gameData: {
      currentUser: null,
      gameId: null,
      opponentHits: [],
      opponentMisses: [],
      opponentShips: null,
      room_id: null,
      turn: null,
      userHits: [],
      userMisses: [],
      userShips: [],
      shipTileValues: [],
      resumedGame: null,
      shipsReady: null,
      playerUsername: null,
      opponentUsername: null,
    },
    resultData: null
  };

  setGameData = (gameData) => {
    this.setState({
      gameData
    })
  };

  resetDefaultGameData = () => {
    this.setState({
      gameData: {
        currentUser: null,
        gameId: null,
        opponentHits: [],
        opponentMisses: [],
        opponentShips: null,
        room_id: null,
        turn: null,
        userHits: [],
        userMisses: [],
        userShips: [],
        shipTileValues: [],
        resumedGame: null,
        shipsReady: null,
        playerUsername: null,
        opponentUsername: null,
      }
    })
  };

  setResultData = (player, gameId, playerUsername, opponentUsername) => {
    this.setState({
      resultData: {
        player: player,
        game: gameId,
        playerUsername,
        opponentUsername
      }
    });
  }

  render() {
    return (
      <main>
        <Switch>
          <Route
            exact
            path={'/'}
            component={Landing}
          />

          <PublicOnlyRoute
            exact
            path={'/signup'}
            component={Signup}
          />

          <PublicOnlyRoute
            exact
            path={'/login'}
            component={Login}
          />

          <PrivateOnlyRoute
            exact
            path={'/help'}
            component={Help}
          />

          <PrivateOnlyRoute
            exact
            path={'/dashboard'}
            component={() => <Dashboard
              setGameData={this.setGameData}
              resetDefaultGameData={this.resetDefaultGameData} />}
          />

          <PrivateOnlyRoute
            exact
            path={'/result'}
            component={() => <Result
              results={this.state.resultData}
            />
            }
          />

          <PrivateOnlyRoute
            exact
            path={'/gameroom'}
            component={() => <GameBoard
              gameData={this.state.gameData}
              setResults={this.setResultData}
            />}
          />

          <PrivateOnlyRoute
            exact
            path={'/history'}
            component={() => <GameHistory
              setResults={this.setResultData}
            />
            }
          />
          <Route
            component={NotFoundRoute}
          />
        </Switch>
      </main>
    );
  }
};


