import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => { 
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
          <Route exact path='/' component={Landing} />
          <section className="container">
            <Alert />
            <switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </switch>
          </section>
      </Fragment>
    </Router>
  </Provider>
)};

export default App;
