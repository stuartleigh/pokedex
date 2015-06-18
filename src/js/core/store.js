import {createStore} from 'fluxxor';

import constants from './constants';
import {PokedexAPI, PokemonAPI} from './service';
import {idFromResourceURI} from './utils';


export default createStore({
	initialize(options) {
		this.loading = false;
		this.storage = options.storage;

		this.pokedex = JSON.parse(this.storage.get('pokedex')) || [];
		this.caughtPokemon = JSON.parse(this.storage.get('caughtPokemon')) || [];

		this.bindActions(
			constants.LOAD_POKEDEX, this.loadPokedex,
			constants.CATCH_POKEMON, this.loadPokemon
		);
	},

	loadPokedex() {
		if (this.pokedex.length > 0) return;
		this.loading = true;

		var api = new PokedexAPI();
		api.get().then(this.onPokedexLoaded).catch(this.onPokedexLoadError);

		this.emit('change');
	},

	onPokedexLoaded(payload) {
		this.loading = false;

		/* the pokeAPI doesn't send them back ordered, so we'll do it ourselves, also we'll filter out the variants */
		var pokedex = payload.pokemon;
		pokedex = pokedex.filter(
			pokemon => idFromResourceURI(pokemon.resource_uri) < 10000
		).sort(
			(a, b) => idFromResourceURI(a.resource_uri) - idFromResourceURI(b.resource_uri)
		);

		this.storage.set('pokedex', JSON.stringify(pokedex));
		this.pokedex = pokedex;

		this.emit('change');
	},

	onPokedexLoadError(payload) {
		this.loading = false;
		console.log('pokedex load error', payload);
		this.emit('change');
	},

	loadPokemon(payload) {
		var api = new PokemonAPI();
		api.get(payload).then(this.catchPokemon).catch(this.onPokemonLoadError);
	},

	catchPokemon(payload) {
		this.caughtPokemon[payload.national_id] = payload;
		this.storage.set('caughtPokemon', JSON.stringify(this.caughtPokemon));
		this.emit('change');
	},

	onPokemonLoadError(payload) {
		console.log('pokemon load error', payload);
	},

	getState() {
		return {
			loading: this.loading,
			pokedex: this.pokedex,
			caughtPokemon: this.caughtPokemon,
		}
	}

});