"use strict";

import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import {idFromResourceURI} from '../core/utils';

let UncaughtPokemon = React.createClass({
	mixins: [FluxMixin(React)],

	onClick() {
		this.getFlux().actions.catchPokemon(this.props.id);
		this.setState({loading: true});
	},

	render() {
		return <li onClick={this.onClick}>{this.props.id}</li>
	}
});

let CaughtPokemon = React.createClass({
	mixins: [FluxMixin(React)],

	render() {
		return <li>{this.props.pokemon.name}</li>
	}
});

export default React.createClass({

	mixins: [FluxMixin(React), StoreWatchMixin('PokedexStore')],

	getStateFromFlux() {
		var flux = this.getFlux();
		return flux.store('PokedexStore').getState();
	},

	render() {
		let pokemon = this.state.caughtPokemon[this.props.id];
		return  pokemon ? <CaughtPokemon pokemon={pokemon} /> : <UncaughtPokemon id={this.props.id} />
	}

});