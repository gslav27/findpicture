import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import drawerStyle from './Drawer.style';

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

const styles = drawerStyle;
 

const _mainUserOptionsData = [
  {
    location: '/favorites',
    text: 'Favorites',
    icon: (className) => <Grade className={className} />,
  },
  {
    location: '/recentlywatched',
    text: 'Recently Watched',
    icon: (className) => <History className={className} />,
  }
];


const _additionalOptionsData = [
  {
    href: 'https://gslav27.github.io/other/parallax_1.html',
    text: 'Parallax',
  },
  {
    href: 'https://gslav27.github.io',
    text: 'gslav27.github.io',
  },
  {
    href: 'https://pixabay.com',
    text: 'Pixabay.com',
  },
];


class MenuDrawer extends Component {
  constructor(props) {
    super(props);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }


  handleListItemClick = (auth) => {
    if (auth) {
      !this.props.auth.isAuthenticated() 
        ? this.props.auth.login() 
        : (this.props.auth.logout(), this.props.clearUserHistory())
    }
    window.scrollTo(0, 0);  
    this.props.onChange(false);
  };


  checkCurrentLocation = (locationForChecking) => (
    this.props.location.pathname === `/findpicture${locationForChecking}`
  )


  render() {
    const { classes, auth, side, open } = this.props;

    let navigationCloseIconLeft, 
        navigationCloseIconRight;


    let _navigationCloseIcon = (
      <ListItemIcon>
        <Close className={classes.headerIcon} onClick={() => this.props.onChange(false)} />
      </ListItemIcon>
    )


    switch (side) {
      case 'right':
        navigationCloseIconRight = _navigationCloseIcon;
        break;
      case 'left':
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
        <ListItemIcon 
          children={<Home className={`${(auth.isAuthenticated() && !this.checkCurrentLocation('/favorites') && !this.checkCurrentLocation('/recentlywatched')) ? classes.locationIcon : null}`} />}
        />
        <ListItemText 
          className={`${classes.itemText} ${(auth.isAuthenticated() && !this.checkCurrentLocation('/favorites') && !this.checkCurrentLocation('/recentlywatched')) ? classes.locationText : null}`} 
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
      <div >
        {
          _mainUserOptionsData.map(option => (
            <ListItem
              key={option.text}
              button 
              component={Link} 
              to={`/findpicture${option.location}`}
              onClick={() => this.handleListItemClick(false)}
            >
              <ListItemIcon 
                children={option.icon(this.checkCurrentLocation(option.location) ? classes.locationIcon : null)}
              />
              <ListItemText
                className={`${classes.itemText} ${this.checkCurrentLocation(option.location) ? classes.locationText : null}`}
                primary={option.text}
                disableTypography
              />
            </ListItem>
          ))
        }
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
          {
            _additionalOptionsData.map(option => (
              <ListItem
                key={option.text}
                button
                component='a'
                href={option.href}
                target='_blank'
                onClick={() => this.props.onChange(false)}
              >
                <ListItemIcon><ContentLink /></ListItemIcon>
                <ListItemText className={classes.itemText} primary={option.text} disableTypography />
              </ListItem>
            ))
          }
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