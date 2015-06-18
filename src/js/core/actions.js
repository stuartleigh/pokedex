import constants from './constants';

export default {
  loadPokedex() {
    this.dispatch(constants.LOAD_POKEDEX, {});
  },

  catchPokemon(id) {
    this.dispatch(constants.CATCH_POKEMON, {id});
  }
}