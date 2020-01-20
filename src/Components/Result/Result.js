import React, { Component } from 'react';
//import { BrowserRouter as Link } from "react-router-dom";
import {withRouter} from 'react-router-dom';
import Button from '../Button/Button';
import Footer from '../Footer/Footer';
import './Result.css';
import Banner from '../Banner/Banner';
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
      player:'',
      game:'',
      winner:'',
      loser:'',
      hRatio:'',
      totalShots:'',
      totalMisses:'',
      totalHits:'',
      player1_hits:[],
      player1_misses:[],
      player2_hits:[],
      player2_misses:[],
    }
  }

  setError = (err) => {
    this.setState({
      error: err.error
    })
  }

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

  updateResults=()=>{
    let player1HitArrayLength =  this.state.player1_hits.length
    let player1MissArrayLength = this.state.player1_misses.length
    let player2HitArrayLength = this.state.player2_hits.length
    let player2MissArrayLength = this.state.player2_misses.length
    if(this.state.player === 'player1'){
      if(player2HitArrayLength > player2HitArrayLength){
        let totalShots = player1HitArrayLength + player1MissArrayLength
        let hitRatio = player1HitArrayLength / totalShots
        let missed = player1MissArrayLength
        this.setState({
          winner:'Player 1',
          loser:'Player 2',
          hRatio:hitRatio,
          totalHits:player1HitArrayLength,
          totalMisses:missed,
          totalShots: totalShots
        })
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
  } else {
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
      } else if (this.state.player2_hits.length < this.state.player1_hits.length){
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

  render() {
    return (
      <div>
        <Banner />

        <div className='result'>
          <h1>Result</h1>
          
          <div className='resultList'>
            <div className='result-box'>
              <h4 className='result-title'>Who Win</h4>
              <p className='result-para'>{this.state.winner} -</p>
            </div>

            <div className='result-box'>
              <h4 className='result-title'>Who Lose</h4>
              <p className='result-para'>{this.state.loser} -</p>
            </div>

            <div className='result-box'>
              <h4 className='result-title'>Hit Ratio</h4>
              <p className='result-para'>{this.state.hRatio} -</p>
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
        </div>
      </div>
    );
  };
};

export default withRouter(Result);


