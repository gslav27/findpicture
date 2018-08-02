import React, { Component } from 'react';
import './App.css';

import { Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ThemeDefault from './ThemeDefault'

import NavBar from './components/NavBar';
import SearchResults from './components/SearchResults';
import UserOptionTemplate from './components/UserOptionTemplate';
import Auth from './components/Auth/Auth';


const auth = new Auth(); 

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={ThemeDefault}>
        <div>
          <Route path="/findpicture" render={(props) => <NavBar auth={auth} {...props} />} />

          <Switch>
            <Route exact path="/findpicture" render={(props) => <SearchResults auth={auth} {...props}/>} />
            <Route path="/findpicture/recentlywatched" render={(props) => {
              return (
                auth.isAuthenticated()
                  ? <UserOptionTemplate componentType='recentlyWatched' auth={auth} {...props} />
                  : <Redirect to={{ pathname: '/findpicture', state: { from: props.location }}} />
              )}}
            />
            <Route path="/findpicture/favorites" render={(props) => {
              return (
                auth.isAuthenticated()
                  ? <UserOptionTemplate componentType='favorites' auth={auth} {...props} />
                  : <Redirect to={{ pathname: '/findpicture', state: { from: props.location } }} />
              )}}
            />
            <Route path="/findpicture/callback" render={(props) => {
              handleAuthentication(props);
              return <div/>
              }}
            />
            <Route path="/findpicture/q_:query?/:page?/:viewer?" render={(props) => <SearchResults auth={auth} {...props} />} />
          </Switch>

        </div >
      </MuiThemeProvider>
    );
  }
}

export default App;