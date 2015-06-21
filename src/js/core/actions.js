import constants from './constants';
import {PokedexAPI, PokemonAPI} from './service';
import {idFromResourceURI} from './utils';

export default {
  loadPokedex() {
    this.dispatch(constants.LOAD_POKEDEX, {});

    var localPokedex = JSON.parse(this.flux.storage.get('pokedex')) || [];
    if (localPokedex.length > 0) {
    	return this.flux.actions.onPokedexLoaded(localPokedex);
    }

    var api = new PokedexAPI();
    api.get().then(this.flux.actions.onPokedexLoaded).catch(this.flux.actions.onPokedexLoadError);
  },

  onPokedexLoaded(pokedex) {
  	this.flux.storage.set('pokedex', JSON.stringify(pokedex));
    this.dispatch(constants.POKEDEX_LOADED, {pokedex});
  },

  onPokedexLoadError(response) {
  	this.dispatch(constants.POKEDEX_LOAD_ERROR, {response});
    console.log('pokedex load error', response);
  },

  loadCaughtPokemon() {
  	var caughtPokemon = JSON.parse(this.flux.storage.get('caughtPokemon')) || [];
  	this.dispatch(constants.LOAD_CAUGHT_POKEMON, {caughtPokemon});
  },

  loadPokemon(id) {
  	this.dispatch(constants.LOAD_POKEMON, {id});
  	var api = new PokemonAPI();
    api.get({id}).then(this.flux.actions.catchPokemon).catch(this.flux.actions.onPokemonLoadError);
  },

  catchPokemon(pokemon) {
  	var caughtPokemon = JSON.parse(this.flux.storage.get('caughtPokemon')) || [];
    caughtPokemon[pokemon.national_id] = pokemon;
    this.flux.storage.set('caughtPokemon', JSON.stringify(caughtPokemon));
    
    this.dispatch(constants.CATCH_POKEMON, {pokemon});
  },

  onPokemonLoadError(response) {
  	this.dispatch(constants.POKEMON_LOAD_ERROR, {response});
    console.log('pokemon load error', response);
  }
}