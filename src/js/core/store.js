import {createStore} from 'fluxxor';

import constants from './constants';
import {PokedexAPI, PokemonAPI} from './service';
import {idFromResourceURI} from './utils';


export default createStore({
  initialize(options) {
    this.loading = false;
    this.caughtPokemon = [];
    this.pokedex = [];

    this.bindActions(
      constants.LOAD_POKEDEX, this.loadPokedex,
      constants.POKEDEX_LOADED, this.onPokedexLoaded,

      constants.LOAD_CAUGHT_POKEMON, this.onLoadCaughtPokemon,

      constants.CATCH_POKEMON, this.catchPokemon,
    );
  },

  loadPokedex() {
    this.loading = true;
    this.emit('change');
  },

  onPokedexLoaded(payload) {
    this.loading = false;
    this.pokedex = payload.pokedex;
    this.emit('change');
  },

  onLoadCaughtPokemon(payload) {
    this.caughtPokemon = payload.caughtPokemon;
    this.emit('change');
  },

  catchPokemon(payload) {
    this.caughtPokemon[payload.pokemon.national_id] = payload.pokemon;
    this.emit('change');
  },

  getState() {
    return {
      loading: this.loading,
      pokedex: this.pokedex,
      caughtPokemon: this.caughtPokemon,
    }
  }

});