import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import {
  addToFavorites,
  authDialogOpen,
  formatData,
  findInFavorites
} from "../../actions/appAddsAction";

import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";

import { auth } from "../Auth/AuthHOC";



class FavoritesButton extends Component {

  handleOnButtonClick = () => {
    let { componentType, imgIndex } = this.props;
    let _addToFavoritesType = () => {
      switch (componentType) {
        case "favorites":
          return 2;
        case "recentlywatched":
          return 1;
        default:
          return 0;
      }
    }
    auth.isAuthenticated()
      ? this.props.addToFavorites(imgIndex, _addToFavoritesType())
      : this.props.authDialogOpen();
  };


  render() {
    const {
      img,
      favorites,
      componentType
    } = this.props;

    let _isFavorite = findInFavorites( img.id, favorites, auth.isAuthenticated());


    let _actionsData = {
      favorites: {
        title: !_isFavorite ? "add to Favorites" : "remove from Favorites",
        icon: !_isFavorite ? <StarBorderIcon /> : <StarIcon />,
        data: !_isFavorite ? img.favorites : img.favorites + 1
      }
    };


    let _favQty = (
      < div >
        <span className='socialDataQty'>
          {formatData(_actionsData.favorites.data)}
        </span>
      </div >
    )

    
    let qtyFromLeft, qtyFromRight;
    componentType
      ? (qtyFromRight = _favQty)
      : (qtyFromLeft = _favQty) 


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
  favorites: PropTypes.array
};

const mapStateToProps = (state) => ({
  favorites: state.appAdds.favorites
})

const mapDispatchToProps = {
  addToFavorites,
  authDialogOpen,
};


export default connect(mapStateToProps, mapDispatchToProps)(FavoritesButton);