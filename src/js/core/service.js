function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {  
    return Promise.resolve(response)  
  } else {  
    return Promise.reject(new Error(response.statusText))  
  } 
}

function parseJSON(response) {
  return response.json();
}

class PokeAPI {
  constructor() {
    this.baseURL = "http://pokeapi.co";
  }

  url() {
    return this.baseURL;
  }

  get(params) {
    return fetch(this.url(params))
      .then(checkStatus)
      .then(parseJSON);
  }
}

export class PokedexAPI extends PokeAPI {
  url() {
    return this.baseURL + '/api/v1/pokedex/1/'
  }
}

export class PokemonAPI extends PokeAPI {
  url(params) {
    return this.baseURL + '/api/v1/pokemon/' + params.id + '/';
  }

  get(params) {
    return super.get(params).then(this.loadSprite.bind(this));
  }

  loadSprite(pokemonData) {
    return fetch(this.baseURL + pokemonData.sprites[0].resource_uri)
      .then(checkStatus)
      .then(parseJSON)
      .then(function(spriteData) {
        pokemonData.spriteURL = this.baseURL + spriteData.image;
        return pokemonData;
      }.bind(this));
  }
}