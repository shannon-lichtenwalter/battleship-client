import React, { Component } from 'react';
//import { BrowserRouter as Link } from "react-router-dom";
import {withRouter} from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import './Result.css';
import LoadGameApiService from '../../Services/load-game-api-service'

class Result extends Component {

  static defaultProps = {
  player:null,
  game:null
  }

  constructor(props){
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

  /*
      The following React lifecycle method is used when the component is initially mounted, to grab player
      and game Id values passed down as props, and to make a call to the 'LoadGameApiService' to fetch the 
      previous game's results. Component state is populated with hits and misses from both player 1 and 
      player 2.
  */
  componentDidMount(){
    const  { player }  = this.props.player ? this.props.player : {}
    const  { game }  = this.props.game ? this.props.game : {}
    LoadGameApiService.getResults(game)
        .then((res)=>{
          console.log(res[0])
          console.log(res[0].player1_hits)
          console.log(res[0].player1_misses)
          console.log(res[0].player2_hits)
          console.log(res[0].player2_misses)
          this.setState({
            player1_hits:JSON.parse(res[0].player1_hits),
            player1_misses:JSON.parse(res[0].player1_misses),
            player2_hits:JSON.parse(res[0].player2_hits),
            player2_misses:JSON.parse(res[0].player2_misses),
            player:player
          })
          this.updateResults()
        })
        .catch((e) => this.setError(e));
  }

  /*
      We are updating the results from the game played based on arrays containing the data of both players'
      hits and misses. Length of array containing hit data determines victor. Calculations are based on the
      length of each player's respective 'hit' and 'misses' arrays, as the data contained is irrelevant in these
      calculations
  */
  updateResults=()=>{
    let player1HitArrayLength =  this.state.player1_hits.length
    let player1MissArrayLength = this.state.player1_misses.length
    let player2HitArrayLength = this.state.player2_hits.length
    let player2MissArrayLength = this.state.player2_misses.length
    // If the current player is 'player1', in the case a loser message is implemented. Also, display relevent
    //    message to the user pertaining to their data
    if(this.state.player=='player1'){
      // If 'player1' has more hits, they are the victor
      if(player1HitArrayLength > player2HitArrayLength){
        let totalShots = player1HitArrayLength + player1MissArrayLength
        let hitRatio = player1HitArrayLength / totalShots
        let missed = player1MissArrayLength
        // We are setting the component state to the winner, loser (if its not a tie), player hit ratio,
        //    total hits on the enemy, total misses on the enemy, and total shots fired in order to render
        //    the correct results. 
        this.setState({
          winner:'Player 1',
          loser:'Player 2',
          hRatio:hitRatio,
          totalHits:player1HitArrayLength,
          totalMisses:missed,
          totalShots: totalShots
        })
        // If 'player1' has less hits than 'player2' they lose
      } else if (this.state.player1_hits.length < this.state.player2_hits.length){
        let totalShots = player1HitArrayLength + player1MissArrayLength
        let hitRatio = player1HitArrayLength / totalShots
        let missed = player1MissArrayLength
        this.setState({
          winner:'Player 2',
          loser:'Player 1',
          hRatio:hitRatio,
          totalHits:player1HitArrayLength,
          totalMisses:missed,
          totalShots: totalShots
        })
        // If there is a tie
      } else {
        let totalShots = player1HitArrayLength + player1MissArrayLength
        let hitRatio = player1HitArrayLength / totalShots
        let missed = player1MissArrayLength
        this.setState({
          winner:'Draw!',
          loser:'It Was a Tie!',
          hRatio:hitRatio,
          totalHits:player1HitArrayLength,
          totalMisses:missed,
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
          winner:'Player 2',
          loser: 'Player 1',
          hRatio:hitRatio,
          totalHits:player2HitArrayLength,
          totalMisses:missed,
          totalShots: totalShots
        })
      // If 'player2' has less hits than 'player1', they lost
      } else if (player2HitArrayLength < player1HitArrayLength){
        let totalShots = player2HitArrayLength + player2MissArrayLength
        let hitRatio = player2HitArrayLength / totalShots
        let missed = player2MissArrayLength
        this.setState({
          winner:'Player 1',
          loser:'Player 2',
          hRatio:hitRatio,
          totalHits:player2HitArrayLength,
          totalMisses:missed,
          totalShots: totalShots,
        })
        // If there is a tie
      } else {
        let totalShots = player2HitArrayLength + player2MissArrayLength
        let hitRatio = player2HitArrayLength / totalShots
        let missed = player2MissArrayLength
        this.setState({
          winner:'Draw!',
          loser:'There Was a Tie!',
          hRatio:hitRatio,
          totalHits:player2HitArrayLength,
          totalMisses:missed,
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
        <h1>Result</h1>
        <div className='result-p'>
          <p>Hit Ratio</p>
          {this.state.hRatio}
          <p>Who Win</p>
          {this.state.winner}
          <p>Who Lose</p>
          {this.state.loser}
          <p>Missed</p>
          {this.state.missed}
          <p>Shots Fired</p>
          {this.state.totalShots}
        </div>

        <Button onClick={() => {
          this.props.history.push('/rematch')
          }}> Rematch
        </Button>

        <Button onClick={() => {
          this.props.history.push('/newgame')
          }}> New Game
        </Button>

        <Button onClick={() => {
          this.props.history.push('/dashboard')
          }}> Exit
        </Button>


        <Footer />
      </div>
    );
  };
};

export default withRouter(Result);


