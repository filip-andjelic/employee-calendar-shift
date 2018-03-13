import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import {Provider} from 'react-redux';
import {Core} from './core/core';
import App from './App';
import {CalendarPageWrapper} from './pages/CalendarPage';
import {Actions} from './core/action_creators';
import '../style/sass/application.scss';

// Listen for complete state reloading from server & update current state
Core.socket.on(Actions.API_ACTION_KEYS.server_state_update, (state) => {
    //Core.store.dispatch(Actions.setState(state));
});

const routes = <Route component={App}>
        <Route path="/" component={CalendarPageWrapper}/>
    </Route>;

ReactDOM.render(
    <Provider store={Core.store}>
        <Router history={hashHistory}>{routes}</Router>
    </Provider>,
    document.getElementById('application-wrapper')
);
