import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { favoritesOrder } from '../../../../../operations/appAddsOperations';
import Backdrop from '../../../../UI/Backdrop';

import favoritesFiltersStyle from './FavoritesFilters.style';


const styles = theme => (favoritesFiltersStyle(theme));


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
};


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


    const orderComponents = Object.keys(orderProps).map((orderType) => {
      const { type, label, titleButtonDown, titleButtonUp } = orderProps[orderType];
      return (
        <div key={orderType} className={classes.filtersLabel}>
          <span
            className={classNames(classes.orderLabel, {
              [classes.mobileFont]: mobileWithTouch,
              [classes.selected]: (favoritesOrderType[type][0] || favoritesOrderType[type][1]),
            })}
          >
            {label}
          </span>
          <div className={classes.orderButtonWrap}>
            <IconButton
              onClick={() => this.handleOrderButtonClick(type, true)}
              className={`${classes.orderButton} ${classes.orderButtonFirst}`}
              title={titleButtonDown}
            >
              <ExpandMore />
              <div className={`${classes.orderButtonSelected} ${favoritesOrderType[type][0] ? 'visible' : 'hidden'}`}><div /></div>
            </IconButton>
            <IconButton
              onClick={() => this.handleOrderButtonClick(type, false)}
              className={classes.orderButton}
              title={titleButtonUp}
            >
              <ExpandLess />
              <div className={`${classes.orderButtonSelected} ${favoritesOrderType[type][1] ? 'visible' : 'hidden'}`}><div /></div>
            </IconButton>
          </div>
        </div>
      );
    });

    
    return (
      <div className={classes.filtersBarWrap}>
        <div className={classes.filtersBar}>
          {orderComponents}
        </div>
        <Divider />
        {/* add backdrop for mobile devices with touch screen && 'xs'-width */}
        {(mobileWithTouch && showFiltersBar && (width === 'xs')) ? <Backdrop onClose={this.props.onChange} /> : null}
      </div>
    );
  }
}

FavoritesFilters.propTypes = {
  showFiltersBar: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  mobileWithTouch: PropTypes.bool.isRequired,
  favoritesOrder: PropTypes.func,
  favoritesOrderType: PropTypes.object,
};

const mapStateToProps = state => ({
  mobileWithTouch: state.appAdds.mobileWithTouch,
  favoritesOrderType: state.appAdds.favoritesOrderType,
});

export default connect(mapStateToProps, { favoritesOrder })(compose(withStyles(styles), withWidth())(FavoritesFilters));
