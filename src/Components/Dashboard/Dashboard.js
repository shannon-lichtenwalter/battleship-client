import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ActiveGameListItem from '../ActiveGameListItem/ActiveGameListItem';
import LoadGameApiService from '../../Services/load-game-api-service';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Dashboard.css';

class Dashboard extends Component {
  state = {
    activeGames: [],
    userId: null,
    error: null,
    userStats: {},
    myTurnGames: [],
    opponentTurnGames: []
  }

  setError = (err) => {
    this.setState({
      error: err.error
    })
  }

  //handleNewGame will reset the state of App to return to the default data.
  //It will then redirect to the gameroom. We have set a timeout to give the state
  //A chance to update prior to redirecting to the gameroom.
  handleNewGame = () => {
    this.props.resetDefaultGameData();
    setTimeout(() => {
      this.props.history.push('/gameroom')
  }, 200);
  }

    //In component did mount we are fetching for the active games and saving them to state.
    //additionally, we are sorting the active games based on if it is the current user's turn or not.
    //the second fetch call is to retrieve all stats for the logged in user.
  componentDidMount(){
    LoadGameApiService.getAllActiveGames()
      .then(res => {
        this.setState({
          activeGames: res.result,
          userId: res.userId
      })
      return res
      }).then(res => {
        let myTurnGames = [];
        let opponentTurnGames = [];
        res.result.map(game => {
          if(res.userId === game.player1 && game.turn === 'player1') {
            return myTurnGames.push(game)
          }
          else if (res.userId === game.player2 && game.turn === 'player2') {
            return myTurnGames.push(game)
          }
          else {
            return opponentTurnGames.push(game)
          }
        });
        this.setState({
          myTurnGames,
          opponentTurnGames,
        })
      })
      .catch((e) => this.setError(e));
    
    LoadGameApiService.getAllUserStats()
    .then(res => {
      this.setState({
        userStats: res
      })
    })
  }

  render() {
    return (
      <div className='dashboard'>
        <Header />
        <h2 className='dashboardWelcome'>Welcome back, <span className='username'>{this.state.userStats.username}</span></h2>
        {this.state.error && <p>Uh oh! Something went wrong: {this.state.error}</p>}
        <h3 className='dash-h3'>Stats</h3>
        <div className='stats'>
          <div className='stat-box'>
            <h3 className='stat-title'>Win</h3>
            <p className='stat-para'>{this.state.userStats.wins} times</p>
          </div>
          <div className='stat-box'>
            <h3 className='stat-title'>Lose</h3>
            <p className='stat-para'>{this.state.userStats.losses} times</p>
          </div>
          <div className='stat-box'>
            <h3 className='stat-title'>Win Ratio</h3>
            <p className='stat-para'>
              {(this.state.userStats.wins + this.state.userStats.losses === 0) 
              ? '0%' 
              : Math.floor(this.state.userStats.wins / (this.state.userStats.wins + this.state.userStats.losses) * 100) + '%'}
            </p>
          </div>
        </div>

        <div className='startGames'>
          <h3 className='dash-h3'>Play BattleShip</h3>          
          <button onClick={()=> this.handleNewGame()}>
            Start a New Game
          </button>
          <h4>Return to an Active Game:</h4>
          <ul className='activeGames'>
            {this.state.myTurnGames.length !== 0 && <h4>Your Turn!</h4>}
            {this.state.myTurnGames && this.state.myTurnGames.map((game, index) => {
            return <ActiveGameListItem 
              key={index} 
              setGameData={this.props.setGameData} 
              game={game} 
              userId={this.state.userId}
              setError= {this.setError}
              /> 
            })}
            {this.state.opponentTurnGames.length !== 0 && <h4>Waiting For Opponent...</h4>}
            {this.state.opponentTurnGames && this.state.opponentTurnGames.map((game, index) => {
            return <ActiveGameListItem 
              key={index} 
              setGameData={this.props.setGameData} 
              game={game} 
              userId={this.state.userId}
              setError= {this.setError}
              /> 
            })}
          </ul>
        </div>
        <Footer />
      </div>
    );
  };
};

export default withRouter(Dashboard);


