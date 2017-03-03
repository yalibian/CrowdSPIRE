/* eslint-disable global-require */
require('babel-polyfill');
/* eslint-enable global-require */
import React from 'react';
import ReactDOM from 'react-dom';

import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {routes} from './routes';

import configureStore from './store/configureStore';

import './assets/temp.styl';

injectTapEventPlugin();
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history} routes={routes}/>
    </Provider>, document.getElementById('app')
);
