import React from 'react';
import ReactDOM from 'react-dom'
// import {render} from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated } from './util/wrappers.js'

// Layouts
import './index.css';
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import Publisher from './layouts/publisher/Publisher'
import Relayer from './layouts/relayer/Relayer'
import Fan from './layouts/fan/Fan'
import SelectAccount from './layouts/registration/SelectAccount'
import Profile from './user/layouts/profile/Profile'
// import * as serviceWorker from './serviceWorker';

// Redux Store
import store from './store'

// const history = syncHistoryWithStore(browserHistory, store)
const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="register" component={UserIsAuthenticated(SelectAccount)} />
          <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />
          <Route path="publisher" component={UserIsAuthenticated(Publisher)} />
          <Route path="relayer" component={UserIsAuthenticated(Relayer)} />
          <Route path="fan" component={UserIsAuthenticated(Fan)} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
