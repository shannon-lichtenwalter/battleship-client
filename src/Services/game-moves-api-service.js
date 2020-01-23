import config from '../config';
import TokenService from './token-service';

const gameMovesApiService = {
  // this function is used to store the users ships' location in the database.
  setShips(shipData, gameId, playerNum) {
    return fetch(`${config.API_ENDPOINT}/api/ships`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        shipData,
        gameId,
        playerNum
    })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : null
      )
  },

  
};

export default gameMovesApiService;


