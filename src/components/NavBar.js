import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';

import { 
  fetchImages,
  fetchAmount,
  fetchOrder,
  fetchCategory,
  fetchColor,
  fetchImageType,
  fetchOrientation,
  fetchPage,
  fetchSearchText,
} from '../actions/searchAction';
import { setWindowTop, fetchUserHistory, clearUserHistory, authDialogOpen } from '../actions/appAddsAction';

import MenuDrawer from './Drawer';
import SearchFilters from './Filters/SearchFilters';
import FavoritesFilters from './Filters/FavoritesFilters';
import AuthenticationNote from './AuthenticationNote';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import AppBar from '@material-ui/core/AppBar';
import Search from '@material-ui/icons/Search';
import Menu from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import FilterList from '@material-ui/icons/FilterList';
import Sort from '@material-ui/icons/FilterList';
import Person from '@material-ui/icons/Person';


const styles = theme => ({
  appBar: {
    backgroundColor: 'rgb(38,50,56)',
    height: 57,
    padding: '0px 4px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    transition: 'border-bottom 0.2s ease',
  },
  appBarBorder: {
    borderBottom: '1px solid rgb(38, 50, 56)',
    [theme.breakpoints.only('xs')]: {
      borderBottom: '1px solid #ddd',
    },
  },
  appBarInputGroup: {
    marginLeft: 4,
    width: '65%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
    [theme.breakpoints.only('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.only('md')]: {
      width: '70%',
    },
  },
  appBarLastChildGroup: {
    display: 'inline-flex',
  },
  appBarIcons: {
    color: '#fff',
  },
  appBarIcons_noAuth: {
    color: '#999',
  },
  filtersButton: {
    height: '1.8em',
    width: '1.8em',
    transition: 'visibility 0.2s ease',
    [theme.breakpoints.only('xs')]: {
      width: '2em',
      height: '2em',
    },
    '& svg': {
      transition: 'all 0.2s ease',
    },
  },
  filtersButtonTop: {
    visibility: 'hidden',
    '& svg': {
      color: 'rgb(38, 50, 56)',
    },
    [theme.breakpoints.only('xs')]: {
      visibility: 'visible',
      '& svg': {
        color: '#fff',
      },
    },
  },
  deleteSearchTextButton: {
    height: '1.6em',
    width: '1.6em',
    padding: '0',
    transition: 'visibility 1s ease',
    visibility: 'hidden',
  },
  deleteSearchTextButtonDisplay: {
    visibility: 'visible',
  },
  inputFieldIcons: {
    color: 'rgb(38, 50, 56)',
  },
  hidden: {
    visibility: 'hidden',
  },
  searchTextIconWrap: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    width: '4em',
    backgroundColor: '#ffeb3b',
    borderRadius: '0px 2px 2px 0px',
    borderLeft: '1px solid #aaa',
    [theme.breakpoints.only('xs')]: {
      borderRadius: '0px 10px 0px 0px',
    },
  },
  searchTextButton: {
    height: '1.6em',
    width: '1.6em',
    padding: '0',
  },
  appBarWrapper: {
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1001,
    transition: 'all 0.1s',
  },
  appBarWrapperHide: {
    transform: 'translate(0px, -57px)',
    [theme.breakpoints.only('xs')]: {
      transform: 'none',
    }
  },
  searchFieldFormControl: {
    width: '100%',
  },
  searchFieldInput: {
    padding: '6px 0px 4px',
    width: '100%',
    // fix .MuiInput-inputType: {height: 1.1875em}
    height: 'initial',
  },
  searchFieldInputRoot: {
    width: '100%',
    paddingLeft: 5,
    fontSize: '1.2em',
    lineHeight: '1.2em',
    height: '2em',
  },
  filtersTop: {
    position: 'relative',
    top: 57,
    [theme.breakpoints.only('xs')]: {
      display: 'none',
    },
  },
  filtersBody: {
    position: 'fixed',
    top: 0,
    height: 57,
    width: '100%',
    display: 'flex',
    alignItems: 'end',
    transition: 'all 0.3s',
    [theme.breakpoints.only('xs')]: {
      top: -200,
    },
  },
  filtersBodyTransform: {
    transform: 'translate(0px, 57px)',
    [theme.breakpoints.only('xs')]: {
      transform: 'translate(0px, 257px)',
    },
  },
  searchFieldWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '2em',
    backgroundColor: '#f5f5f5',
    borderRadius: 1,
  },
  searchFieldWrapMobile: {
    borderRadius: '2px',
    [theme.breakpoints.only('xs')]: {
      borderRadius: '0px 10px 0px 0px',
    },
  },
})

let userHistoryLoaded = false;


class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      showFilters: false,
      windowPageYOffset: 0,
      hideHeader: false,
      inputOnFocus: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollThrottled = throttle(this.handleScroll, 250);
    this.handleDeleteSearchText = this.handleDeleteSearchText.bind(this);
  }


  componentDidMount() {
    window.addEventListener('scroll', this.handleScrollThrottled);
  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollThrottled.cancel());
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (!userHistoryLoaded && this.props.auth.isAuthenticated()) {
      userHistoryLoaded = true; 
      this.props.fetchUserHistory();
    } else if (!this.props.auth.isAuthenticated()) {
      userHistoryLoaded = false;
    };
    if (this.props.width !== prevProps.width) {
      (this.props.width === 'xs') ? this.setState({ showFilters: false }) : null;
      (this.props.width !== 'xs') ? this.setState({ hideHeader: false }) : null;
    };
  }


  handleScroll() {
    let currentYOffset = window.pageYOffset;
    let prevYOffset = this.state.windowPageYOffset;
    if ((currentYOffset < 40) && (!this.props.windowTop)) {
      this.props.setWindowTop();
    } else if ((currentYOffset >= 40) && (this.props.windowTop)) {
      this.props.setWindowTop(false);
    }
    // hide NavBar on Scroll Down (and showing it on Scroll Up) in mobile devices with touch screen
    if (this.props.mobileWithTouch) {
      this.setState({
        windowPageYOffset: currentYOffset,
      });
      switch (true) {
        case (currentYOffset < 150):
          this.setState({
            hideHeader: false,
          });
          break;
        case (((currentYOffset - prevYOffset) > 20) && !this.state.hideHeader):
          this.setState({
            hideHeader: true,
            showFilters: false,
          });
          break;
        case (((currentYOffset - prevYOffset) < -10) && this.state.hideHeader):
          this.setState({
            hideHeader: false,
          });
          break;
        default:
          break;
      }
    } 
  }


  handleMenuButtonClick = () => {
    this.setState({
      showDrawer: !this.state.showDrawer,
    })
  }


  handleFiltersButtonClick = () => {
    this.setState({
      showFilters: !this.state.showFilters,
    })
  }


  handleDeleteSearchText = () => {
    this.props.fetchSearchText('');
    this.props.fetchImages();
    this.searchTextInput.focus();
  }

  
  render() {
    const { 
      mobileWithTouch,
      windowTop,
      classes,
      location,
      width,
      auth,
      authDialog,
      searchText,
      history
    } = this.props;

    const {
      showDrawer,
      showFilters,
      hideHeader,
      inputOnFocus,
    } = this.state;

    let filtersType,
        // navigationMenuIcon,
        navigationMenuIconLeft,
        navigationMenuIconRight,
        drawerFromLeft,
        userAuthenticationIcon,
        searchIcon,
        filtersIconType;


    const _deleteSearchTextIcon = (
      <IconButton
        onClick={this.handleDeleteSearchText}
        className={`${classes.deleteSearchTextButton} ${(searchText.length > 0) ? classes.deleteSearchTextButtonDisplay : null}`}
      >
        <Close className={classes.inputFieldIcons}/>
      </IconButton>
    );


    const _searchTextIcon = (
      <div className={classes.searchTextIconWrap}>
        <IconButton
          onClick={() => inputOnFocus ? (this.props.fetchImages(), this.setState({inputOnFocus: false })) : this.searchTextInput.focus()}
          className={classes.searchTextButton}
        >
          <Search className={classes.inputFieldIcons} />
        </IconButton>
      </div>
    )


    const _navigationMenuIcon = (
      <IconButton onClick={this.handleMenuButtonClick}>
        <Menu className={classes.appBarIcons} />
      </IconButton>
    );


    const _userAuthenticationIcon = (
        <IconButton
          onClick={() => { 
            auth.isAuthenticated()
              ? ( auth.logout(), this.props.clearUserHistory())
              : auth.login()
          }}
          title={auth.isAuthenticated() ? 'Logout' : 'Login'}
        >
          <Person className={auth.isAuthenticated() ? classes.appBarIcons : classes.appBarIcons_noAuth} />
        </IconButton>
      )


    const _searchIcon = (
      <IconButton
        className={mobileWithTouch ? classes.hidden : null}
        onClick={() => this.searchTextInput.focus()}
      >
        <Search className={classes.appBarIcons} />
      </IconButton>
    );


    // define filters & filter icon type depends on current location
    switch (true) {
      case (location.pathname === '/findpicture/favorites'):
        filtersType = <FavoritesFilters showFiltersBar={showFilters} onChange={() => this.setState({ showFilters: false })} />
        filtersIconType = <Sort className={classes.appBarIcons} />
        break;
      case (location.pathname === '/findpicture/recentlywatched'):
        filtersType = null
        filtersIconType = null
        break;
      default:
        filtersType = <SearchFilters showFiltersBar={showFilters} onChange={() => this.setState({ showFilters: false })} />
        filtersIconType = <FilterList className={classes.appBarIcons} />
        break;
    }


    const filtersIcon = (
      <IconButton
        onClick={this.handleFiltersButtonClick}
        className={`${classes.filtersButton} ${windowTop ? classes.filtersButtonTop : null}`}
      >
        {filtersIconType}
      </IconButton>
    );


    const filtersTop = (
      <div className={`${classes.filtersTop} ${showFilters ? classes.hidden : null}`}>
        {filtersType}
      </div>
    );


    const filtersBody = (
      <div className={`${classes.filtersBody} ${showFilters ? classes.filtersBodyTransform : null}`} >
        {filtersType}
      </div>
    );


    // define how render some icons & Drawer side depends on current width
    if (width === 'xs') {
      navigationMenuIconRight = _navigationMenuIcon;
      searchIcon = null;
      navigationMenuIconLeft = null;
      userAuthenticationIcon = null;
      drawerFromLeft = false;
    } else {
      searchIcon = _searchIcon;
      navigationMenuIconLeft = _navigationMenuIcon;
      userAuthenticationIcon = _userAuthenticationIcon
      navigationMenuIconRight = null;
      drawerFromLeft = true;
    }


    const inputField = (
      <div className={`${classes.searchFieldWrap} ${mobileWithTouch ? classes.searchFieldWrapMobile : null}`}>
        <form
          className={classes.searchFieldFormControl}
          action='#'
          onSubmit={
            (e) => {
              e.preventDefault();
              this.searchTextInput.blur();
              mobileWithTouch ? (this.props.fetchImages(), ((location.pathname === '/findpicture/favorites') || (location.pathname === '/findpicture/recentlywatched')) ? history.push("/findpicture/") : null) : null;
            }
          }
        >
          <Input
            type={mobileWithTouch ? 'search' : null}
            classes={{
              root: classes.searchFieldInputRoot,
              input: classes.searchFieldInput,
            }}
            value={searchText}
            onChange={
              (e) => {
                this.props.fetchSearchText(e.target.value);
                mobileWithTouch ? null : (this.props.fetchImages(), ((location.pathname === '/findpicture/favorites') || (location.pathname === '/findpicture/recentlywatched')) ? history.push("/findpicture/") : null);
              }
            }
            placeholder='Search...'
            disableUnderline={true}
            autoFocus={mobileWithTouch ? false : true}
            inputRef={input => this.searchTextInput = input}
            onFocus={() => this.setState({ inputOnFocus: true })}
          />
        </form>
        {_deleteSearchTextIcon}
        {mobileWithTouch ? _searchTextIcon : null}
      </div>
    )


    const menuDrawer = (
      <MenuDrawer
        open={showDrawer}
        side={drawerFromLeft ? 'left' : 'right'}
        onChange={(val) => this.setState({ showDrawer: val })}
        auth={auth}
        clearUserHistory={this.props.clearUserHistory}
        location={location}
      />
    );


    const authenticationNotification = (
      <AuthenticationNote
        auth={auth}
        open={authDialog}
        authDialogOpen={this.props.authDialogOpen}
      />
    )


    return (
      <div>
        <div className={`${classes.appBarWrapper} ${hideHeader ? classes.appBarWrapperHide : null}`}>
          <AppBar className={`${classes.appBar} ${(windowTop || showFilters) ? classes.appBarBorder : null}`}>
            {navigationMenuIconLeft}
            <div className={classes.appBarInputGroup}>
              {searchIcon}
              {inputField}
              {filtersIcon}
            </div>
            <div className={classes.appBarLastChildGroup}>
              {userAuthenticationIcon}
              {navigationMenuIconRight}
            </div>
          </AppBar>
          {filtersBody}
        </div>
        {filtersTop}
        {showDrawer ? menuDrawer : null}
        {!auth.isAuthenticated() ? authenticationNotification : null}
      </div>
    )
  }
}

NavBar.propTypes = {
  fetchSearchText: PropTypes.func.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchAmount: PropTypes.func.isRequired,
  fetchOrder: PropTypes.func,
  fetchCategory: PropTypes.func,
  fetchColor: PropTypes.func,
  fetchImageType: PropTypes.func,
  fetchOrientation: PropTypes.func,
  fetchPage: PropTypes.func,
  fetchUserHistory: PropTypes.func,
  clearUserHistory: PropTypes.func,
  setWindowTop: PropTypes.func,
  authDialogOpen: PropTypes.func,
  searchText: PropTypes.string.isRequired,
  mobileWithTouch: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  order: PropTypes.string,
  orientation: PropTypes.string,
  imageType: PropTypes.string,
  category: PropTypes.string,
  color: PropTypes.array,
  page: PropTypes.number,
  amount: PropTypes.number,
  windowTop: PropTypes.bool,
  authDialog: PropTypes.bool,
}

const mapStateToProps = state => ({
  searchText: state.search.searchText,
  mobileWithTouch: state.appAdds.mobileWithTouch,
  order: state.search.order,
  orientation: state.search.orientation,
  imageType: state.search.imageType,
  category: state.search.category,
  color: state.search.color,
  page: state.search.page,
  amount: state.search.amount,
  windowTop: state.appAdds.windowTop,
  authDialog: state.appAdds.authDialog,
})

const mapDispatchToProps = {
  fetchImages,
  fetchSearchText,
  fetchAmount,
  fetchOrder,
  fetchCategory,
  fetchColor,
  fetchImageType,
  fetchOrientation,
  fetchPage,
  setWindowTop,
  fetchUserHistory,
  clearUserHistory,
  authDialogOpen,
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles), withWidth(), )(NavBar))