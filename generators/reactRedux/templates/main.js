/*eslint react/display-name: 0*/
import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/app-container";
import { Router, Route } from 'react-router';
import historyManager from "./history";
import immutableStorageDecorator from "./immutable-storage-decorator"
import {createStore, applyMiddleware, bindActionCreators} from "redux"
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk"
import {rootReducer} from "./reducer"
import * as unboundActions from "./actions"
import pricingApi from "./pricing-api"
import * as storage from "redux-storage"
import createEngine from "redux-storage-engine-localstorage"
import storageDebounce from 'redux-storage-decorator-debounce'
import createLogger from 'redux-logger';
import saveCredentialsMiddleware from "./save-credentials-middleware"
import cookies from "cookies-js";


////////////////////////////////////////////////////////////////////////////////
// redux stuff


// wrap our main reducer in a storage reducer - this intercepts LOAD actions and
// calls the merger function to merge in the new state
const reducer = storage.reducer(rootReducer, (oldState, newState) => newState)
// create a storage engine, with decorators to convert plain JS into Immutable
// and "debounce" storage so it's not happening all the time
const engine = storageDebounce(immutableStorageDecorator(createEngine("odds-interface")), 2000)
// create storage middleware, which triggers a save action after every normal action
const storageMiddleware = storage.createMiddleware(engine)
// create logger middleware
const loggerMiddleware = createLogger({
  stateTransformer: state => state.toJS(),
  // you can filter out certain actions from logging
  //predicate: (getState, action) => action.type !== CALCULATION_NEEDS_REFRESH
})
// now create our redux store, applying all our middleware
const store = createStore(reducer, applyMiddleware(
  thunkMiddleware, // first, so function results get transformed
  loggerMiddleware, // now log everything at this state
  saveCredentialsMiddleware, // save credentials to cookies
  storageMiddleware, // finally the storage middleware
))
// now everything is set up, create a loader and use it to load the store
const load = storage.createLoader(engine)
const loaded = load(store)
loaded.then((newState) => {

  // create a set of actions that are bound to our store
  const actions = bindActionCreators(unboundActions, store.dispatch)

  ////////////////////////////////////////////////////////////////////////////////
  // authentication

  pricingApi.on("loginfail", () => {
    console.log("detected login fail, logging out")
    store.dispatch(actions.logout())
  });

  // recover login details from cookies
  const username = cookies.get("X-Auth-Username");
  const authToken = cookies.get("X-Auth-Token");

  if (username && authToken) {
    console.log("stored credentials found; updating store")
    actions.restoreLogin(username, authToken)
    actions.restoreAccessPolicy(newState.get("permissions"));
    actions.getFixtures()
  }
  else {
    console.log("no stored credentials found")
    actions.logout()
  }

  ////////////////////////////////////////////////////////////////////////////////
  // other plumbing

  // wrapper class injects store data into App
  /*
  const TopLevelWrapper = React.createClass({
    displayName: "TopLevelWrapper",
    propTypes: {
      children: React.PropTypes.node
    },
    componentWillMount () {
      this.setState({stores: store.getState()});
      this.subscription = store.subscribe(() => {
        this.setState({stores: store.getState()});
      });
    },
    componentWillUnmount () {
      this.subscription.dispose();
    },
    render () {
      return <App
        actions={actions}
        stores={this.state.stores}>
        {this.props.children || <span>Default route?</span> }
      </App>
    }
  });
  */

  ////////////////////////////////////////////////////////////////////////////////
  // render a router into the page

  ReactDOM.render(
    <Provider store={store}>
      <Router historyManager={historyManager}>
        <Route path="/" component={App} name="root">
        </Route>
      </Router>
    </Provider>,
    document.getElementById("app")
  );
})
