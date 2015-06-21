import {idFromResourceURI} from './utils';

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
  constructor(options) {
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

  get(params) {
    return super.get(params).then(this.sortPokedex.bind(this));
  }

  sortPokedex(pokedexData) {
    /* the pokeAPI doesn't send them back ordered, so we'll do it ourselves, also we'll filter out the variants */
    var pokedex = pokedexData.pokemon;
    pokedex = pokedex.filter(
      pokemon => idFromResourceURI(pokemon.resource_uri) < 10000
    ).sort(
      (a, b) => idFromResourceURI(a.resource_uri) - idFromResourceURI(b.resource_uri)
    );
    return pokedex;
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