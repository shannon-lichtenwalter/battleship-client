import React, { Component } from 'react';
//import { BrowserRouter as Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import './Result.css';
import LoadGameApiService from '../../Services/load-game-api-service';
import Header from '../Header/Header';


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
          console.log(res[0])
          console.log(res[0].player1_hits)
          console.log(res[0].player1_misses)
          console.log(res[0].player2_hits)
          console.log(res[0].player2_misses)
          this.setState({
            player1_hits: JSON.parse(res[0].player1_hits),
            player1_misses: JSON.parse(res[0].player1_misses),
            player2_hits: JSON.parse(res[0].player2_hits),
            player2_misses: JSON.parse(res[0].player2_misses),
            player: player
          })
          this.updateResults()
        })
        .catch((e) => this.setError(e));
    }
  }

  updateResults = () => {
    let player1HitArrayLength = this.state.player1_hits.length
    let player1MissArrayLength = this.state.player1_misses.length
    let player2HitArrayLength = this.state.player2_hits.length
    let player2MissArrayLength = this.state.player2_misses.length
    if (this.state.player === 'player1') {
      if (player1HitArrayLength > player2HitArrayLength) {
        let totalShots = player1HitArrayLength + player1MissArrayLength
        let hitRatio = player1HitArrayLength / totalShots
        let missed = player1MissArrayLength
        // We are setting the component state to the winner, loser (if its not a tie), player hit ratio,
        //    total hits on the enemy, total misses on the enemy, and total shots fired in order to render
        //    the correct results. 
        this.setState({
          winner: 'Player 1',
          loser: 'Player 2',
          hRatio: hitRatio,
          totalHits: player1HitArrayLength,
          totalMisses: missed,
          totalShots: totalShots
        })
      } else if (this.state.player1_hits.length < this.state.player2_hits.length) {
        let totalShots = player1HitArrayLength + player1MissArrayLength
        let hitRatio = player1HitArrayLength / totalShots
        let missed = player1MissArrayLength
        this.setState({
          winner: 'Player 2',
          loser: 'Player 1',
          hRatio: hitRatio,
          totalHits: player1HitArrayLength,
          totalMisses: missed,
          totalShots: totalShots
        })
        // If there is a tie
      } else {
        let totalShots = player1HitArrayLength + player1MissArrayLength
        let hitRatio = player1HitArrayLength / totalShots
        let missed = player1MissArrayLength
        this.setState({
          winner: 'Draw!',
          loser: 'It Was a Tie!',
          hRatio: hitRatio,
          totalHits: player1HitArrayLength,
          totalMisses: missed,
          totalShots: totalShots
        })
      }
  // If the current player is 'player2', in the case a loser message is implemented
  } else {
      // If 'player2' has more hits than 'player1', they are the victor
      if(player2HitArrayLength > player1HitArrayLength){
        let totalShots = player2HitArrayLength + player2MissArrayLength
        let hitRatio = player2HitArrayLength / totalShots
        let missed = player2MissArrayLength
        this.setState({
          winner: 'Player 2',
          loser: 'Player 1',
          hRatio: hitRatio,
          totalHits: player2HitArrayLength,
          totalMisses: missed,
          totalShots: totalShots
        })
      // If 'player2' has less hits than 'player1', they lost
      } else if (player2HitArrayLength < player1HitArrayLength){
        let totalShots = player2HitArrayLength + player2MissArrayLength
        let hitRatio = player2HitArrayLength / totalShots
        let missed = player2MissArrayLength
        this.setState({
          winner: 'Player 1',
          loser: 'Player 2',
          hRatio: hitRatio,
          totalHits: player2HitArrayLength,
          totalMisses: missed,
          totalShots: totalShots,
        })
        // If there is a tie
      } else {
        let totalShots = player2HitArrayLength + player2MissArrayLength
        let hitRatio = player2HitArrayLength / totalShots
        let missed = player2MissArrayLength
        this.setState({
          winner: 'Draw!',
          loser: 'There Was a Tie!',
          hRatio: hitRatio,
          totalHits: player2HitArrayLength,
          totalMisses: missed,
          totalShots: totalShots
        })
      }
    }
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
      {/* <div>
        <Banner />

        <div className='result'>
          <h1>Result</h1>
          
          <div className='resultList'>
            <div className='result-box'>
              <h4 className='result-title'>Who Win</h4>
              <p className='result-para'>{this.state.winner}</p>
            </div>

            <div className='result-box'>
              <h4 className='result-title'>Who Lose</h4>
              <p className='result-para'>{this.state.loser}</p>
            </div>

            <div className='result-box'>
              <h4 className='result-title'>Hit Ratio</h4>
              <p className='result-para'>{this.state.hRatio}</p>
            </div>

            <div className='result-box'>
              <h4 className='result-title'>Missed</h4>
              <p className='result-para'>{this.state.missed} times</p>
            </div>

            <div className='result-box'>
              <h4 className='result-title'>Shots Fired</h4>
              <p className='result-para'>{this.state.totalShots} times</p>
            </div>
          </div>

          <Button className='resultbtn' onClick={() => {
            this.props.history.push('/rematch')
            }}> Rematch
          </Button>

          <Button className='resultbtn' onClick={() => {
            this.props.history.push('/newgame')
            }}> New Game
          </Button>

          <Button className='resultbtn' onClick={() => {
            this.props.history.push('/dashboard')
            }}> Exit
          </Button>

          <Footer />
        </div> */}
      </div>
    );
  };
};

export default withRouter(Result);


