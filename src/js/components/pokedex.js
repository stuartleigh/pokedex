"use strict";

import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import {idFromResourceURI} from '../core/utils';

import Pokemon from './pokemon';

export default React.createClass({

  mixins: [FluxMixin(React), StoreWatchMixin('PokedexStore')],

  getStateFromFlux() {
    var flux = this.getFlux();
    return flux.store('PokedexStore').getState();
  },

  render() {

    let pokemon = this.state.pokedex.map(pokemon => <Pokemon id={idFromResourceURI(pokemon.resource_uri)} />)

    return (
      <ul>
        {pokemon}
      </ul>
    );
  }

});