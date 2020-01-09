import config from '../config';
//import TokenService from './token-service';

const gameMovesApiService = {
  // this function is used to store the users ships' location in the database.
  //we need to also send the gameId of the current game so that the locations of the players' ships
  // are stored for that game only.
  setShips(shipData, gameId, playerNum) {
    return fetch(`${config.API_ENDPOINT}/ships`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        //'authorization': `bearer ${TokenService.getAuthToken()}`
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
          : res.json()
      )
  },

  //this function accepts the target, gameId, and playerNum(ie: player1 or player2) in order
  // to check the opponents' ships to see if a hit was made. The return response from the server 
  //will be a result object containing 'hit' or 'miss' as the result and a ship name or null for ship value.
  // ie:  result = {result:'hit', ship:'aircraft carrier'} or result = {result:'miss', ship:null}.
  fireAtTarget(target, gameId, playerNum){
    return fetch(`${config.API_ENDPOINT}/ships/opponent`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        //'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        target,
        gameId,
        playerNum
    })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }
}

export default gameMovesApiService;