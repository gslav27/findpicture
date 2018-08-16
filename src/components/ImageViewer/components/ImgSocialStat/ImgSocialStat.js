import React, { Component } from 'react';

import { formatData, findInFavorites } from '../../../../actions/appAddsAction';

import { withStyles } from '@material-ui/core/styles';
import ImgSocialStatStyles from './ImgSocialStat.styles';

import IconButton from '@material-ui/core/IconButton';

import Chat from '@material-ui/icons/Chat';
import Pageview from '@material-ui/icons/Pageview';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';


const styles = ImgSocialStatStyles;


class ImgSocialStat extends Component {
  render() {
    const {
      currentImg,
      currentImgInd,
      favorites,
      classes,
      auth,
    } = this.props;

    let _isFavorite = findInFavorites(currentImg.id, favorites, auth.isAuthenticated())

    return (
      <div className={`${classes.toolBar} ${classes.toolBarBottom}`}>
        <IconButton
          className={`${classes.viewerIconButton} ${classes.buttonsHover}`}
          onClick={() => auth.isAuthenticated() ? this.props.addToFavorites(currentImgInd) : this.props.authDialogOpen()}
          title={!_isFavorite ? 'add to Favorites' : 'remove from Favorites'}
        >
          {!_isFavorite
            ? <StarBorderIcon className={classes.viewerIconStyle} />
            : <StarIcon className={classes.viewerIconStyle} />
          }
        </IconButton>
        <div className={classes.socialData}>
          {formatData((!_isFavorite ? currentImg.favorites : (currentImg.favorites + 1)))}
        </div>
        <IconButton
          className={`${classes.viewerIconButton} ${classes.buttonsHover}`}
          title='read at Pixabay'
          href={currentImg.pageURL}
          target='_blank'
        >
          <Chat className={classes.viewerIconStyle} />
        </IconButton>
        <div className={classes.socialData}> {formatData(currentImg.comments)} </div>
        <IconButton
          className={`${classes.viewerIconButton} ${classes.buttonsHover}`}
          title='see at Pixabay'
          href={currentImg.pageURL}
          target='_blank'
        >
          <Pageview className={classes.viewerIconStyle} />
        </IconButton>
        <div className={classes.socialData}> {formatData(currentImg.views)} </div>
      </div>
    );
  }
}


export default withStyles(styles)(ImgSocialStat)