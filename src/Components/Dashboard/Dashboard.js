import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActiveGameListItem from '../ActiveGameListItem/ActiveGameListItem';
import LoadGameApiService from '../../Services/load-game-api-service';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Button from '../Button/Button';
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

  componentDidMount(){
    
    //fetch for the active games and save them to state.
    LoadGameApiService.getAllActiveGames()
    .then(res => {

      this.setState({
        activeGames: res.result,
        userId: res.userId
      })
      return res
    }).then(res => {
      //the following then block is sorting which games is it the logged in
      //users turn in versus the games that are waiting for the opponent.
      let myTurnGames = [];
      let opponentTurnGames = [];

      res.result.map(game => {
        if(res.userId === game.player1 && game.turn === 'player1'){
          myTurnGames.push(game)
      }else if(res.userId === game.player2 && game.turn === 'player2'){
        myTurnGames.push(game)
      }else{
        opponentTurnGames.push(game)
      }
    });
    this.setState({
      myTurnGames,
      opponentTurnGames,
    })
    })
    .catch((e) => this.setError(e));
    
    //get all the stats for the user
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

        {this.state.error && <p>{this.state.error}</p>}
        
        <div className='startGames'>
        <h3>Play BattleShip</h3>          
          <button onClick={()=> this.props.setGameData(null)}>
            <Link to='/gameroom'>
              Start a New Game
            </Link>
          </button>
        <h4>Return to an Active Game:</h4>
        <ul className='activeGames'>
          {this.state.myTurnGames.length !== 0 && <h4>Your Turn!</h4>}
          {this.state.myTurnGames && this.state.myTurnGames.map((game, index) => {
          return <ActiveGameListItem key={index} setGameData={this.props.setGameData} game={game} userId={this.state.userId}/> 
          })}
          {this.state.opponentTurnGames.length !== 0 && <h4>Waiting For Opponent...</h4>}
          {this.state.opponentTurnGames && this.state.opponentTurnGames.map((game, index) => {
          return <ActiveGameListItem key={index} setGameData={this.props.setGameData} game={game} userId={this.state.userId}/> 
          })}
        </ul>

        </div>

        <div className='stats'>
          <h2>Stats</h2>

          <h2>Win</h2>
          <p>{this.state.userStats.wins} times</p>

          <h2>Lose</h2>
          <p>{this.state.userStats.losses} times</p>

          <h2>Win Ratio</h2>
          <p>{(this.state.userStats.wins + this.state.userStats.losses === 0) 
            ? '0%' 
            : Math.floor(this.state.userStats.wins / (this.state.userStats.wins + this.state.userStats.losses) * 100) + '%'}</p>

        </div>

        <Footer />
      </div>
    );
  };
};

export default Dashboard;


