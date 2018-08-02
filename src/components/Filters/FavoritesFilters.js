import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import { favoritesOrder } from '../../actions/appAddsAction';

import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


const styles = theme => ({
  filtersBarWrap: {
    width: '100%',
  },
  filtersBar: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingTop: '3px',
    margin: '0px 2px',
    borderBottom: '2px solid #fff',
    fontSize: '1em',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-around',
    },
    [theme.breakpoints.only('xs')]: {
      flexFlow: 'column',
      margin: '0px',
    },
    '& > div': {
      [theme.breakpoints.only('xs')]: {
        maxWidth: '100%',
      },
      '&:hover': {
        borderRadius: 2,
      },
    }
  },
  filtersBarBackdrop: {
    display: 'none',
    height: '100vh',
    width: '100vw',
    bottom: 0,
    zIndex: -1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    transition: 'all 0.3s ease',
    [theme.breakpoints.only('xs')]: {
      display: 'block',
    },
  },
  filtersLabel: {
    color: '#777',
    height: '2em',
    margin: 0,
    fontSize: '1em',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    [theme.breakpoints.only('xs')]: {
      borderBottom: '2px solid #ddd',
      marginLeft: 0,
    },
  },
  mobileFont: {
    [theme.breakpoints.only('xs')]:{
      fontSize: '1.05em',
    },
  },
  orderLabel: {
    textAlign: 'right',
    [theme.breakpoints.only('xs')]:{
      flex: 1,
    },
  },
  orderButtonWrap: {
    display: 'inherit',
    [theme.breakpoints.only('xs')]: {
      flex: 1,
    },
  },
  orderButton: {
    width: '1.3em',
    height: '1.3em',
    margin: '3px 0px 0px 0px', 
  },
  orderButtonFirst: {
    marginLeft: -3,
    marginRight: -3,
    [theme.breakpoints.only('xs')]: {
      marginLeft: 5,
    },
  },
  orderButtonSelected: {
    transition: 'all 0.3s ease',
    position: 'absolute',
    bottom: 5,
    left: 0,
    width: '100%',
    '& > div' : {
      width: '0.5em',
      margin: '0 auto',
      borderBottom: '1px solid #d50000', 
    },
  },
  selected: {
    color: '#d50000',
  },
})



class FavoritesFilters extends Component {
  componentWillUnmount = () => {
    this.props.favoritesOrderType.addDate[0] ? null : this.props.favoritesOrder('addDate', true);
    (this.props.width === 'xs') ? this.props.onChange() : null;
  }


  handleOrderButtonClick = (type, higherFirst) => {
    this.props.favoritesOrder(type, higherFirst);
    (this.props.width === 'xs') ? this.props.onChange() : null;
    window.scrollTo(0, 0);
  }


  render() {
    const { classes, showFiltersBar, mobileWithTouch, width, favoritesOrderType } = this.props;

    const orderProps = {
      date: {
        type: 'addDate',
        label: 'date',
        titleButtonUp: 'the oldest first',
        titleButtonDown: 'the newest first',
      },
      favorites: {
        type: 'favorites',
        label: 'favorites',
        titleButtonUp: 'from lower to higher', 
        titleButtonDown: 'from higher to lower',
      },
      comments: {
        type: 'comments',
        label: 'comments',
        titleButtonUp: 'from the less commented',
        titleButtonDown: 'from the most commented',
      },
      downloads: {
        type: 'downloads',
        label: 'downloads',
        titleButtonUp: 'from the less downloaded',
        titleButtonDown: 'from the most downloaded',
      },
    }


    const orderComponents = Object.keys(orderProps).map(orderType => {
      let orderObj = orderProps[orderType];
      return (
        <div key={orderType} className={classes.filtersLabel}>
          <span className={`${classes.orderLabel} ${mobileWithTouch ? classes.mobileFont : null} ${(favoritesOrderType[orderObj.type][0] || favoritesOrderType[orderObj.type][1]) ? classes.selected : null}`}>
            {orderObj.label}
          </span>
          <div className={classes.orderButtonWrap}>
            <IconButton
              onClick={() => this.handleOrderButtonClick(orderObj.type, true)}
              className={`${classes.orderButton} ${classes.orderButtonFirst}`}
              title={orderObj.titleButtonDown}
            >
              <ExpandMore />
              <div className={`${classes.orderButtonSelected} ${favoritesOrderType[orderObj.type][0] ? 'visible' : 'hidden'}`}><div/></div>
            </IconButton>
            <IconButton
              onClick={() => this.handleOrderButtonClick(orderObj.type, false)}
              className={classes.orderButton}
              title={orderObj.titleButtonUp}
            >
              <ExpandLess />
              <div className={`${classes.orderButtonSelected} ${favoritesOrderType[orderObj.type][1] ? 'visible' : 'hidden'}`}><div/></div>
            </IconButton>
          </div>
        </div>
    )});

    
    return (
      <div className={classes.filtersBarWrap}>
        <div className={classes.filtersBar}>
          {orderComponents}
        </div>
        <Divider />
        {/* add backdrop for mobile devices with touch screen && 'xs'-width */}
        {(mobileWithTouch && showFiltersBar && (width === 'xs')) ? <div className={classes.filtersBarBackdrop} onClick={this.props.onChange}></div> : null}
      </div>
    )
  }
}

FavoritesFilters.propTypes = {
  showFiltersBar: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  mobileWithTouch: PropTypes.bool.isRequired,
  favoritesOrder: PropTypes.func,
  favoritesOrderType: PropTypes.object,
}

const mapStateToProps = state => ({
  mobileWithTouch: state.appAdds.mobileWithTouch,
  favoritesOrderType: state.appAdds.favoritesOrderType,
})

export default connect(mapStateToProps, { favoritesOrder })(compose(withStyles(styles), withWidth(), )(FavoritesFilters))