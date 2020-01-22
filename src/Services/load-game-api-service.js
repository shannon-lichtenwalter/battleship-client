import config from '../config';
import TokenService from './token-service';


const loadGamesApiService = {
  //retrieves the active games for the currently logged in user.
  getAllActiveGames(){
      return fetch(`${config.API_ENDPOINT}/api/games`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        },
      })
        .then(res =>
          (!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json()
        )
    },


    getGameHistory(){
      return fetch(`${config.API_ENDPOINT}/api/games/prev`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        },
      })
        .then(res =>
          (!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json()
        )
    },


//retrieves the data for a resumed game
    resumeActiveGame(gameId){
      return fetch(`${config.API_ENDPOINT}/api/games/activegame/${gameId}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        },
      })
        .then(res => 
          (!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json()
        )
    },
    
// quit active game
    quitActiveGame(gameId){
      return fetch(`${config.API_ENDPOINT}/api/games/activegame/${gameId}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
        .then(res =>
          (!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json()
        )
    },

    getResults(gameId){
      //only to games endpoint when sending auth header.
        return fetch(`${config.API_ENDPOINT}/api/games/results/${gameId}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${TokenService.getAuthToken()}`
          },
        })
          .then(res =>
            (!res.ok)
              ? res.json().then(e => Promise.reject(e))
              : res.json()
          )
      },
//retreives all of the game stats for the logged in user.
    getAllUserStats(){
      return fetch(`${config.API_ENDPOINT}/api/games/stats`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        },
      })
        .then(res =>
          (!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json()
        )
    }

  };

export default loadGamesApiService;


