import config from '../config';
import TokenService from './token-service';


const loadGamesApiService = {
  //in the future you should just have to send the authorization header
  //and then the backend can access the userId from the jwt token.
  //currently the endpoint is /1 because I am hardcoding to get userid 1's active games.

  getAllActiveGames(){
    //only to games endpoint when sending auth header.
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

    resumeActiveGame(gameId, playerNum){
      return fetch(`${config.API_ENDPOINT}/api/games/activegame/${gameId}/${playerNum}`, {
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

  };


export default loadGamesApiService;