import React, { Component } from 'react';
import PropTypes from "prop-types";
import Auth from './AuthActions';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { authDialogOpen } from '../../actions/appAddsAction';


export const auth = new Auth(); 


const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}


const withAuth = (WrappedComponent, type) => {
  class HOC extends Component {
    render() {
      if (type === 'authCallback') {
        handleAuthentication(this.props);
        return <div />
      } else if (auth.isAuthenticated()) {
        return <WrappedComponent auth={auth} componentType={type} {...this.props}/>
      } else {
        this.props.authDialogOpen();
        return <Redirect to={{ pathname: '/findpicture', state: { from: this.props.location } }} />
      }
    }
  }
  return connect(null, { authDialogOpen} )(HOC);
} 


withAuth.propTypes = {
  authDialogOpen: PropTypes.func
};

export default withAuth;