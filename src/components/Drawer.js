import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Close from '@material-ui/icons/Close';
import Home from '@material-ui/icons/Home';
import Grade from '@material-ui/icons/Grade';
import History from '@material-ui/icons/History';
import ContentLink from '@material-ui/icons/Link';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Forward from '@material-ui/icons/Forward';

const styles = {
  drawerHeader: {
    backgroundColor: 'rgb(38,50,56)',
    height: 57,
    paddingRight: 0,
  },
  headerIcon: {
    color: '#fff',
    cuheaderIconrsor: 'pointer',
  },
  headerText: {
    fontSize: '1.5em',
    color: '#fff',
  },
  itemText: {
    fontSize: '1.1em',
  },
  authItem: {
    padding:  '5px 24px 5px 24px', 
    opacity: 0.8,
    backgroundColor: '#ddd',
    textAlign: 'center',
  },
  authText: {
    fontWeight: '500', 
    maxWidth: 225,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  locationIcon: {
    color: '#000',
  },
  locationText: {
    fontWeight: 500,
  }
}; 
 


class MenuDrawer extends Component {
  constructor(props) {
    super(props);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }


  handleListItemClick = (auth) => {
    auth
      ? (!this.props.auth.isAuthenticated() ? this.props.auth.login() : (this.props.auth.logout(), this.props.clearUserHistory()))
      : null
    window.scrollTo(0, 0);  
    this.props.onChange(false);
  };


  render() {
    const { classes, auth, location, side, open } = this.props;

    let navigationCloseIconLeft, 
        navigationCloseIconRight;


    let _navigationCloseIcon = (
      <ListItemIcon>
        <Close className={classes.headerIcon} onClick={() => this.props.onChange(false)} />
      </ListItemIcon>
    )


    switch (true) {
      case ( side === 'right' ):
        navigationCloseIconRight = _navigationCloseIcon;
        break;
      case ( side === 'left' ):
        navigationCloseIconLeft = _navigationCloseIcon;
        break;
      default:
        break;
    }


    const _drawerHeader = (
      <div> 
        <ListItem className={classes.drawerHeader} >
          {navigationCloseIconLeft}
          <ListItemText className={classes.headerText} primary="FindPicture" disableTypography />
          {navigationCloseIconRight}
        </ListItem>
        <Divider />
      </div>
    )


    const _userName = (
      <ListItem disabled={true} className={classes.authItem} button onClick={() => this.handleListItemClick(true)}>
        <ListItemText className={`${classes.itemText} ${classes.authText}`} primary={localStorage.getItem('findpicture_user')} disableTypography />
      </ListItem>
    ) 


    const _homeButton = (
      <ListItem className={classes.list} button component={Link} to='/findpicture/' onClick={() => this.handleListItemClick(false)}>
        <ListItemIcon><Home className={`${(auth.isAuthenticated() && (location.pathname !== '/findpicture/favorites') && (location.pathname !== '/findpicture/recentlywatched')) ? classes.locationIcon : null}`} /></ListItemIcon>
        <ListItemText 
          className={`${classes.itemText} ${(auth.isAuthenticated() && (location.pathname !== '/findpicture/favorites') && (location.pathname !== '/findpicture/recentlywatched')) ? classes.locationText : null}`} 
          primary="Home" 
          disableTypography
        />
      </ListItem>
    )


    const _loginButton = (
      <ListItem button onClick={() => this.handleListItemClick(true)}>
        <ListItemIcon><Forward /></ListItemIcon>
        <ListItemText className={classes.itemText} primary='Login' disableTypography />
      </ListItem>
    )


    const _userOptions = (
      < div >
        <ListItem button component={Link} to='/findpicture/favorites' onClick={() => this.handleListItemClick(false)}>
          <ListItemIcon><Grade className={`${(location.pathname === '/findpicture/favorites') ? classes.locationIcon : null}`} /></ListItemIcon>
          <ListItemText
            className={`${classes.itemText} ${(location.pathname === '/findpicture/favorites') ? classes.locationText : null}`}
            primary="Favorites"
            disableTypography
          />
        </ListItem>
        <ListItem button component={Link} to='/findpicture/recentlywatched' onClick={() => this.handleListItemClick(false)}>
          <ListItemIcon><History className={`${(location.pathname === '/findpicture/recentlywatched') ? classes.locationIcon : null}`} /></ListItemIcon>
          <ListItemText
            className={`${classes.itemText} ${(location.pathname === '/findpicture/recentlywatched') ? classes.locationText : null}`}
            primary="Recently Watched"
            disableTypography
          />
        </ListItem>
        <ListItem button onClick={() => this.handleListItemClick(true)}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText className={classes.itemText} primary="Logout" disableTypography />
        </ListItem>
      </div >
    )


    const _mainOptions = (
      <div>
        <List>
          {_homeButton}
          {auth.isAuthenticated() ? _userOptions : _loginButton}
        </List>
        <Divider />
      </div>
    )


    const _additionalOptions = (
      <div>
        <List>
          <ListItem button component='a' href='https://gslav27.github.io/other/parallax_1.html' target='_blank' onClick={() => this.props.onChange(false)}>
            <ListItemIcon><ContentLink /></ListItemIcon>
            <ListItemText className={classes.itemText} primary="Parallax" disableTypography />
          </ListItem>
          <ListItem button component='a' href='https://gslav27.github.io' target='_blank' onClick={() => this.props.onChange(false)}>
            <ListItemIcon><ContentLink /></ListItemIcon>
            <ListItemText className={classes.itemText} primary="gslav27.github.io" disableTypography />
          </ListItem>
          <ListItem button component='a' href='https://pixabay.com' target='_blank' onClick={() => this.props.onChange(false)}>
            <ListItemIcon><ContentLink /></ListItemIcon>
            <ListItemText className={classes.itemText} primary="Pixabay.com" disableTypography />
          </ListItem>
        </List>
        <Divider />
      </div>
    )

    
    return (
      <Drawer
        anchor={side}
        open={open}
        onClose={() => this.props.onChange(false)}
      > 
        <div>
          { _drawerHeader }
          { auth.isAuthenticated() ? _userName : null }
          { _mainOptions }
          { _additionalOptions }
        </div>
      </Drawer>
    )
  }
}

MenuDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  side: PropTypes.string,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MenuDrawer)