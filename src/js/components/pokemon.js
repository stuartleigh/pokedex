"use strict";

import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import {idFromResourceURI} from '../core/utils';

import classnames from 'classnames';


let UncaughtPokemon = React.createClass({
  mixins: [FluxMixin(React)],

  getInitialState() {
    return {
      loading: false
    }
  },

  onClick() {
    this.getFlux().actions.catchPokemon(this.props.id);
    this.setState({loading: true});
  },

  render() {
    let itemClasses = {
      'PokemonList-Item': true,
      'PokemonList-Item--uncaught': true,
    }

    let pokeballClasses = {
      'PokeBall': true,
      'PokeBall--spinning': this.state.loading
    }
    return (
      <li onClick={this.onClick} className={classnames(itemClasses)}>
        <div className={classnames(pokeballClasses)}>
          <div className="PokeBall-Gap"></div>
          <div className="PokeBall-Button">{this.props.id}</div>
        </div>
      </li>
    );
  }
});

let CaughtPokemon = React.createClass({
  mixins: [FluxMixin(React)],

  render() {
    let classes = {
      "PokemonList-Item": true,
      "PokemonList-Item--caught": true,
    }
    this.props.pokemon.types.forEach(
      type => classes["PokemonList-Item--" + type.name] = true
    );
    
    return <li className={classnames(classes)}>{this.props.pokemon.name}</li>
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