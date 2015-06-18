"use strict";

import React from 'react';
import {Flux} from 'fluxxor';

import actions from './core/actions';

import PokedexStore from './core/store.js';

import App from './app';
import LocalStorage from './storage';


var stores = {
	PokedexStore: new PokedexStore({storage: new LocalStorage()}),
}

var flux = new Flux(stores, actions);

React.render(
	<App flux={flux} />,
	document.getElementById('Pokedex')
)

