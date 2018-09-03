import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Auth from './AuthActions';

import { authDialogOpen } from '../../actions/appAddsAction';


export const auth = new Auth();


const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};


const withAuth = (WrappedComponent, type) => {
  const HOC = (props) => {
    if (type === 'authCallback') {
      handleAuthentication(props);
      return <div />;
    } if (auth.isAuthenticated()) {
      return <WrappedComponent auth={auth} componentType={type} {...props} />;
    } else {
      props.authDialogOpen();
      return <Redirect to={{ pathname: '/findpicture', state: { from: props.location } }} />;
    }
  };
  return connect(null, { authDialogOpen })(HOC);
};


withAuth.propTypes = { authDialogOpen: PropTypes.func };

export default withAuth;
