import React from 'react';
import { withRouter } from 'react-router-dom';
import LoadGameApiService from '../../Services/load-game-api-service';
import './GameHistory.css';
import Button from '../Button/Button';
import Header from '../Header/Header';
import './GameHistory.css';
import Footer from '../Footer/Footer';

class GameHistory extends React.Component {
    state = {
        error: null,
    }

    setError = (err) => {
        this.setState({
            error: err.error,
            history: null
        })
    }

    componentDidMount = () => {
        LoadGameApiService.getGameHistory()
            .then(data => {
                this.setState({
                    history: data
                })
            })
    }

    handleInspect = (player, gameId, playerUsername, opponentUsername, playerWin) => {
        this.props.setResults(player, gameId, playerUsername, opponentUsername, playerWin);
        this.props.history.push('/result');
    }

    render() {
        let completedGames = 'No game history availiable';
        let userWelcome = null
        if (this.state.history) {
            userWelcome = <h2 className='dashboardWelcome'><span className='username'>{this.state.history.playerUsername}</span>'s Game History</h2>

            completedGames = this.state.history.result.map(game => {
                let playerUsername = this.state.history.playerUsername;
                let opponentUsername = game.player1_username === playerUsername ? game.player2_username : game.player1_username;


                let winnerUsername = game[`${[game.winner]}_username`];
                let winBool = playerUsername === winnerUsername;
                let winStatus = winBool ? 'Win' : 'Loss';


                let playerString = playerUsername === game.player1_username ? 'player1' : 'player2'

                let winReason = null;

                if (game.game_status === 'complete') winReason = 'skill';
                else if (game.game_status === 'expired') winReason = 'default';
                else if (game.game_status === 'forfeited') winReason = 'forfeit';

                return (
                    <li key={game.game_id} className='game-history-li'>
                        <div className='game-history-region'>
                            <span className={`player-${winStatus}`}>{winStatus} vs {opponentUsername}</span>
                            <p>{winnerUsername} won by {winReason}</p>
                        </div>
                        <div className='game-history-region'>
                            <Button onClick={() => this.handleInspect(playerString, game.game_id, playerUsername, opponentUsername, winBool)}>Inspect</Button>
                        </div>
                    </li>
                );
            })
        }

        return (
            <div className='gameHistory'>
                <Header />
                {userWelcome}
                <h2>Game History</h2>
                
                <ul className='game-history-list'>
                    {completedGames}
                </ul>

                <Footer />
            </div>
        );
    }
}

export default withRouter(GameHistory);


