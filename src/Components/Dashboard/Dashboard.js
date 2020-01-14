import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActiveGameListItem from '../ActiveGameListItem/ActiveGameListItem';
import LoadGameApiService from '../../Services/load-game-api-service';

import './Dashboard.css';

export default class Dashboard extends Component {
  state = {
    activeGames: [],
    userId: null,
    error: null,
    userStats: {}
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
          {this.state.activeGames && this.state.activeGames.map((game, index) => {
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
          <p>{Math.floor(this.state.userStats.wins / (this.state.userStats.wins + this.state.userStats.losses) * 100) + '%'}</p>
        </div>



        <footer>
          Copyright © since 2020
        </footer>
      </div>
    );
  };
  
};