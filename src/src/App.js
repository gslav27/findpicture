import React, { Component } from 'react';
import './App.css';

import { Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ThemeDefault from './ThemeDefault'

import NavBar from './components/NavBar/NavBar';
import SearchResults from './components/SearchResults/SearchResults';
import UserOptionTemplate from './components/UserOptionTemplate/UserOptionTemplate';
import withAuth from './components/Auth/AuthHOC';


class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={ThemeDefault}>
        <div> 
          <Route path="/findpicture" component={NavBar} /> 
          <Switch>
            <Route exact path="/findpicture" component={SearchResults} />
            <Route path="/findpicture/recentlyWatched" component={withAuth(UserOptionTemplate, 'recentlyWatched')} />
            <Route path="/findpicture/favorites" component={withAuth(UserOptionTemplate, 'favorites')} />
            <Route path="/findpicture/callback" component={withAuth(null, 'authCallback')} />
            <Route exact path="/findpicture/q_:query?/:page?/:viewer?" component={SearchResults} />
          </Switch>
        </div >
      </MuiThemeProvider>
    );
  }
}

export default App;