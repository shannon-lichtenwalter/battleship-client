import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import LoadGameApiService from '../../Services/load-game-api-service';
import Button from '../Button/Button';
import Header from '../Header/Header';
import './Result.css';


class Result extends Component {

  static defaultProps = {
    player: null,
    game: null
  }

  constructor(props) {
    super(props);
    this.state={
      error:null,
      player:'',              // player1 or player2
      game:'',                // game ID
      winner:'',              // Winner of game, as player1 or player2
      loser:'',               // Loser of game (if not a tie), as player1 or player2
      hRatio:'',              // Player hits divided by total shots taken
      totalShots:'',          // Total shots fired at opponent (hits + misses)
      totalMisses:'',         // Total shots at opponent (misses)
      totalHits:'',           // Total shots at opponent (hits)
      player1_hits:[],        // Array holding values of first player hits (alphanumeric cell values)
      player1_misses:[],      // Array holding values of first player misses       ''      ''   
      player2_hits:[],        // Array holding values of second player hits (alphanumeric cell values)
      player2_misses:[],      // Array holding values of second player misses      ''      ''
    }
  }

  /*
      If an error occurs while component is loading, we are setting it here in state
  */
  setError = (err) => {
    this.setState({
      error: err.error
    })
  }

  componentDidMount() {
    if (this.props.results) {
      const player = this.props.results.player;
      const game = this.props.results.game;
      LoadGameApiService.getResults(game)
        .then((res) => {

          let p1Hits = JSON.parse(res[0].player1_hits);
          let p1Misses = JSON.parse(res[0].player1_misses);
          let p2Hits = JSON.parse(res[0].player2_hits);
          let p2Misses = JSON.parse(res[0].player2_misses);

          this.setState({
            player1_hits: p1Hits ? p1Hits: [],
            player1_misses: p1Misses ? p1Misses: [],
            player2_hits: p2Hits ? p2Hits: [],
            player2_misses: p2Misses ? p2Misses: [],
            player: player
          },() => this.updateResults())
          
        })
        .catch((e) => this.setError(e));
    }
  }

  updateResults = () => {
    let playerString = this.props.results.player;


    let hits = this.state[`${playerString}_hits`].length;
    let misses = this.state[`${playerString}_misses`].length;
    let totalShots = hits + misses;
    let hitRatio = hits / totalShots;
    let winnerUsername = this.props.results.playerWin ? this.props.results.playerUsername : this.props.results.opponentUsername;
    let loserUsername = this.props.results.playerWin ? this.props.results.opponentUsername : this.props.results.playerUsername;

    this.setState({
      winner: winnerUsername,
      loser: loserUsername,
      hRatio: hitRatio ? hitRatio: 0,
      totalHits: hits,
      totalMisses: misses,
      totalShots: totalShots
    });
  }

  /*
      Render method which displays the results of the previous match. Buttons rendered below results 
      display route to either a new game, a rematch, or back to the dashboard.
  */
  render() {
    return (
      <div className='result'>
        <Header />


        <h1>Result</h1>
        <ul className='results-ul'>

          {this.props.results ? <h2>{`${this.props.results.playerUsername} vs ${this.props.results.opponentUsername}`}</h2> : null}

          <li><span className='results-left'>Winner: </span>
            <span className='results-right'>{this.state.winner}</span></li>

          <li><span className='results-left'>Loser: </span>
            <span className='results-right'>{this.state.loser}</span></li>

          <li><span className='results-left'>Hit Ratio: </span>
            <span className='results-right'>{(this.state.hRatio * 100).toFixed(2)}%</span></li>

          <li><span className='results-left'>Shots Fired: </span>
            <span className='results-right'>{this.state.totalShots}</span></li>

          <li><span className='results-left'>Shots Hit: </span>
            <span className='results-right'>{this.state.totalHits}</span></li>
            
          <li><span className='results-left'>Shots Missed: </span>
            <span className='results-right'>{this.state.totalMisses}</span></li>

        </ul>


        <Button onClick={() => {
          this.props.history.push('/newgame')
        }}> New Game
        </Button>

        <Button onClick={() => {
          this.props.history.push('/dashboard')
        }}> Exit
        </Button>
      </div>
    );
  };
};

export default withRouter(Result);


