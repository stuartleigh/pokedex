"use strict";

import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import Pokedex from './components/pokedex';

export default React.createClass({

  mixins: [FluxMixin(React), StoreWatchMixin('PokedexStore')],

  getStateFromFlux() {
    var flux = this.getFlux();
    return flux.store('PokedexStore').getState();
  },

  componentDidMount() {
    this.getFlux().actions.loadPokedex();
  },

  render() {
    return (
      <div>
        {this.state.loading ? <h2>loading</h2> : <Pokedex />}
      </div>
    );
  }

});