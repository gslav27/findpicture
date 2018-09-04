import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';

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
import Sort from '@material-ui/icons/Sort';
import Person from '@material-ui/icons/Person';

import { fetchImages, fetchSearchText } from '../../operations/searchOperations';
import { setWindowTop, fetchUserHistory, clearUserHistory } from '../../actions/appAddsAction';

import MenuDrawer from './components/MenuDrawer/Drawer';
import SearchFilters from './components/Filters/SearchFilters/SearchFilters';
import FavoritesFilters from './components/Filters/FavoritesFilters/FavoritesFilters';
import AuthenticationNote from '../Auth/AuthenticationAlert/AuthenticationAlert';

import navBarStyle from './NavBar.style';

import { auth } from '../Auth/AuthHOC';


const styles = theme => (navBarStyle(theme));

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
  }


  componentDidMount() {
    window.addEventListener('scroll', this.handleScrollThrottled);
  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollThrottled.cancel());
  }


  componentDidUpdate = (prevProps) => {
    if (!userHistoryLoaded && auth.isAuthenticated()) {
      userHistoryLoaded = true;
      this.props.fetchUserHistory();
    } else if (!auth.isAuthenticated()) {
      userHistoryLoaded = false;
    }
    if (this.props.width !== prevProps.width) {
      (this.props.width === 'xs')
        ? this.setState({ showFilters: false })
        : this.setState({ hideHeader: false });
    }
  }


  handleScroll = () => {
    const currentYOffset = window.pageYOffset;
    const prevYOffset = this.state.windowPageYOffset;
    if ((currentYOffset < 40) && (!this.props.windowTop)) {
      this.props.setWindowTop();
    } else if ((currentYOffset >= 40) && (this.props.windowTop)) {
      this.props.setWindowTop(false);
    }
    // hide NavBar on Scroll Down (and showing it on Scroll Up) in mobile devices with touch screen
    if (this.props.mobileWithTouch) {
      this.setState({ windowPageYOffset: currentYOffset });
      switch (true) {
        case (currentYOffset < 150):
          this.setState({ hideHeader: false });
          break;
        case (((currentYOffset - prevYOffset) > 20) && !this.state.hideHeader):
          this.setState({
            hideHeader: true,
            showFilters: false,
          });
          break;
        case (((currentYOffset - prevYOffset) < -10) && this.state.hideHeader):
          this.setState({ hideHeader: false });
          break;
        default:
          break;
      }
    }
  }


  handleMenuButtonClick = () => {
    this.setState({ showDrawer: !this.state.showDrawer });
  }


  handleFiltersButtonClick = () => {
    this.setState({ showFilters: !this.state.showFilters });
  }


  handleDeleteSearchText = () => {
    this.props.fetchSearchText('');
    this.props.fetchImages();
    this.searchTextInput.focus();
  }


  handleSearchTextIconClick = () => {
    this.state.inputOnFocus
      ? (this.props.fetchImages(), this.setState({ inputOnFocus: false }))
      : this.searchTextInput.focus();
  }


  handleUserAuthenticationIconClick = () => {
    auth.isAuthenticated()
      ? (auth.logout(), this.props.clearUserHistory())
      : auth.login();
  }


  handleFiltersChange = () => {
    this.setState({ showFilters: false });
  }


  handleLocation = () => {
    const { location, history } = this.props;
    if ((location.pathname === '/findpicture/favorites') || (location.pathname === '/findpicture/recentlywatched')) {
      history.push('/findpicture/');
    }
  }


  handleSearchTextFormSubmit = (e) => {
    e.preventDefault();
    const { mobileWithTouch } = this.props;
    this.searchTextInput.blur();
    if (mobileWithTouch) {
      this.props.fetchImages();
      this.handleLocation();
    }
  }


  handleSearchTextChange = (e) => {
    e.preventDefault();
    const { mobileWithTouch } = this.props;
    this.props.fetchSearchText(e.target.value);
    if (!mobileWithTouch) {
      this.props.fetchImages();
      this.handleLocation();
    }
  }

  
  render() {
    const {
      mobileWithTouch,
      windowTop,
      classes,
      location,
      width,
      searchText,
    } = this.props;

    const {
      showDrawer,
      showFilters,
      hideHeader,
    } = this.state;

    let filtersType,
      navigationMenuIconLeft,
      navigationMenuIconRight,
      drawerFromLeft,
      userAuthenticationIcon,
      searchIcon,
      filtersIconType;


    const _deleteSearchTextIcon = (
      <IconButton
        onClick={this.handleDeleteSearchText}
        className={`${classes.deleteSearchTextButton} ${searchText.length ? classes.deleteSearchTextButtonDisplay : null}`}
      >
        <Close className={classes.inputFieldIcons} />
      </IconButton>
    );

    
    const _searchTextIcon = (
      <div className={classes.searchTextIconWrap}>
        <IconButton
          onClick={this.handleSearchTextIconClick}
          className={classes.searchTextButton}
        >
          <Search className={classes.inputFieldIcons} />
        </IconButton>
      </div>
    );


    const _navigationMenuIcon = (
      <IconButton onClick={this.handleMenuButtonClick}>
        <Menu className={classes.appBarIcons} />
      </IconButton>
    );


    const _userAuthenticationIcon = (
      <IconButton
        onClick={this.handleUserAuthenticationIconClick}
        title={auth.isAuthenticated() ? 'Logout' : 'Login'}
      >
        <Person className={auth.isAuthenticated() ? classes.appBarIcons : classes.appBarIcons_noAuth} />
      </IconButton>
    );


    const _searchIcon = (
      <IconButton
        className={mobileWithTouch ? classes.hidden : null}
        onClick={() => this.searchTextInput.focus()}
      >
        <Search className={classes.appBarIcons} />
      </IconButton>
    );


    // define filters & filter icon type depends on current location
    switch (location.pathname) {
      case '/findpicture/favorites':
        filtersType = <FavoritesFilters showFiltersBar={showFilters} onChange={() => this.handleFiltersChange()} />;
        filtersIconType = <Sort className={classes.appBarIcons} />;
        break;
      case '/findpicture/recentlywatched':
        filtersType = null;
        filtersIconType = null;
        break;
      default:
        filtersType = <SearchFilters showFiltersBar={showFilters} onChange={() => this.handleFiltersChange()} />;
        filtersIconType = <FilterList className={classes.appBarIcons} />;
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
      <div className={`${classes.filtersBody} ${showFilters ? classes.filtersBodyTransform : null}`}>
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
      userAuthenticationIcon = _userAuthenticationIcon;
      navigationMenuIconRight = null;
      drawerFromLeft = true;
    }


    const inputField = (
      <div className={`${classes.searchFieldWrap} ${mobileWithTouch ? classes.searchFieldWrapMobile : null}`}>
        <form
          className={classes.searchFieldFormControl}
          action='#'
          onSubmit={e => this.handleSearchTextFormSubmit(e)}
        >
          <Input
            type={mobileWithTouch ? 'search' : null}
            classes={{
              root: classes.searchFieldInputRoot,
              input: classes.searchFieldInput,
            }}
            value={searchText}
            onChange={e => this.handleSearchTextChange(e)}
            placeholder='Search...'
            disableUnderline
            autoFocus={!mobileWithTouch}
            inputRef={input => this.searchTextInput = input}
            onFocus={() => this.setState({ inputOnFocus: true })}
          />
        </form>
        {_deleteSearchTextIcon}
        {mobileWithTouch ? _searchTextIcon : null}
      </div>
    );


    const menuDrawer = (
      <MenuDrawer
        open={showDrawer}
        side={drawerFromLeft ? 'left' : 'right'}
        onChange={val => this.setState({ showDrawer: val })}
        auth={auth}
        clearUserHistory={this.props.clearUserHistory}
        location={location}
      />
    );


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
        {!auth.isAuthenticated() ? <AuthenticationNote /> : null}
      </div>
    );
  }
}

NavBar.propTypes = {
  fetchSearchText: PropTypes.func.isRequired,
  fetchImages: PropTypes.func.isRequired,
  fetchUserHistory: PropTypes.func,
  clearUserHistory: PropTypes.func,
  setWindowTop: PropTypes.func,
  searchText: PropTypes.string.isRequired,
  mobileWithTouch: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  windowTop: PropTypes.bool,
};

const mapStateToProps = state => ({
  searchText: state.search.searchText,
  mobileWithTouch: state.appAdds.mobileWithTouch,
  windowTop: state.appAdds.windowTop,
});

const mapDispatchToProps = {
  fetchImages,
  fetchSearchText,
  setWindowTop,
  fetchUserHistory,
  clearUserHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles), withWidth())(NavBar));
