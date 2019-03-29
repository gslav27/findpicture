import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';

import {
  addToFavorites,
  authDialogOpen,
  formatData,
  findInFavorites,
} from '../../operations/appAddsOperations';


import { auth } from '../Auth/AuthHOC';



class FavoritesButton extends Component {
  handleOnButtonClick = () => {
    const { componentType, imgIndex } = this.props;
    const _addToFavoritesType = () => {
      switch (componentType) {
        case 'favorites':
          return 2;
        case 'recentlyWatched':
          return 1;
        default:
          return 0;
      }
    };
    auth.isAuthenticated()
      ? this.props.addToFavorites(imgIndex, _addToFavoritesType())
      : this.props.authDialogOpen();
  };


  render() {
    const {
      img,
      favorites,
      componentType,
    } = this.props;

    const _isFavorite = findInFavorites(img.id, favorites, auth.isAuthenticated());


    const _actionsData = {
      favorites: {
        title: !_isFavorite ? 'add to Favorites' : 'remove from Favorites',
        icon: !_isFavorite ? <StarBorderIcon /> : <StarIcon />,
        data: !_isFavorite ? img.favorites : img.favorites + 1,
      },
    };


    const _favQty = (
      <div>
        <span className='socialDataQty'>
          {formatData(_actionsData.favorites.data)}
        </span>
      </div>
    );

    
    let qtyFromLeft,
      qtyFromRight;
    componentType
      ? (qtyFromRight = _favQty)
      : (qtyFromLeft = _favQty);


    return (
      <React.Fragment>
        {qtyFromLeft}
        <IconButton
          className='socialDataIconButton'
          onClick={() => this.handleOnButtonClick()}
          title={_actionsData.favorites.title}
          children={_actionsData.favorites.icon}
        />
        {qtyFromRight}
      </React.Fragment>
    );
  }
}


FavoritesButton.propTypes = {
  addToFavorites: PropTypes.func.isRequired,
  authDialogOpen: PropTypes.func.isRequired,
  favorites: PropTypes.array,
};

const mapStateToProps = state => ({ favorites: state.appAdds.favorites });

const mapDispatchToProps = {
  addToFavorites,
  authDialogOpen,
};


export default connect(mapStateToProps, mapDispatchToProps)(FavoritesButton);
