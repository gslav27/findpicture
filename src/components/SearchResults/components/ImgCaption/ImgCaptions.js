import React, { Component } from 'react';
import { formatData, findInFavorites } from '../../../../actions/appAddsAction';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import imgCaptionsStyle from './ImgCaptions.style';

import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';


const styles = (theme) => (imgCaptionsStyle(theme))


class ImgCaption extends Component {
  handleOnTagClick = (tag) => {
    this.props.fetchSearchText(tag);
    this.props.fetchPage(1);
    this.props.fetchImages();
  }

  render() {
    const {
      img,
      imgIndex,
      favorites,
      classes,
      auth,
    } = this.props;

    let _isFavorite = findInFavorites(img.id, favorites, auth.isAuthenticated())

    let _tagsArray;
    // check divider type in img.tags property (',' or ' ' ) and convert tags string to array
    (img.tags.split(',').length > 1)
      ? (_tagsArray = img.tags.split(','))
      : (_tagsArray = img.tags.split(' '))

    const imgTags = (
      <div className={classes.gridListTileBarTitle}>
        {
          _tagsArray.map((tag, tagIndex) => (
            <span
              className={classes.barTitleTag}
              key={tagIndex}
              title={`search for '${tag.trim()}'`}
              onClick={() => this.handleOnTagClick(tag.trim())}
            >
              #{tag.trim()}
            </span>
          ))
        }
      </div>
    )

    const imgAuthor = (
      <div className={classes.gridListTileBarSubtitle}>
        <span>
          by: <a
            className={classes.barTitleTag}
            href={`https://pixabay.com/users/${img.user}-${img.user_id}/`}
            target='_blank'
            title={`'${img.user}' profile at Pixabay`}
          >
            {img.user}
          </a>
        </span>
      </div>
    )

    const imgFavoritesQty = (
      <div>
        <span className={classes.socialData}>
          {formatData((!_isFavorite ? img.favorites : (img.favorites + 1)))}
        </span>
      </div>
    )

    const imgFavoritesButton = (
      <IconButton
        className={classes.iconButton}
        onClick={() => auth.isAuthenticated() ? this.props.addToFavorites(imgIndex) : this.props.authDialogOpen()}
        title={!_isFavorite ? 'add to Favorites' : 'remove from Favorites'}
      >
        {!_isFavorite ? <StarBorderIcon className={classes.icon} /> : <StarIcon className={classes.icon} />}
      </IconButton>
    )

    return (
      <div className={classes.gridListTileBarRoot}>
        <div className={classes.gridListTileBarText}>
          {imgTags}
          {imgAuthor}
        </div>
        {imgFavoritesQty}
        {imgFavoritesButton}
      </div>
    );
  }
}

export default compose(withStyles(styles), withWidth(), )(ImgCaption)