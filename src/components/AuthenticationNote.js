import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions';

import Report from '@material-ui/icons/Report';


const styles = {
  dialog: {
    zIndex: 1503,
  },
  dialogContent: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  loginButton: {
    backgroundColor: '#ffeb3b',
    minWidth: 150,
    marginBottom: 10,
    '&:hover ':{
      backgroundColor: '#efdb2b',
    }
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    width: '2.5em',
    height: '2.5em',
    color: '#ffeb3b',
  }
}



class AuthenticationNote extends Component {
  handleClose = () => {
    this.props.authDialogOpen(false)
  }

  render() {
    const { classes, auth, open } = this.props;

    return (
      <Dialog
        className={classes.dialog}
        open={open}
        onClose={this.handleClose}
      >
        <DialogTitle className={classes.center}>
          FindPicture
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Report className={classes.icon} /> 
          <DialogContentText>
            You are not authenticated 
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.center}>
          <Button
            className={classes.loginButton}
            onClick={() => (auth.login(), setTimeout(() => this.handleClose(), 1000))}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

AuthenticationNote.propTypes = {
  authDialogOpen: PropTypes.func,
  open: PropTypes.bool,
  auth: PropTypes.object,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AuthenticationNote)