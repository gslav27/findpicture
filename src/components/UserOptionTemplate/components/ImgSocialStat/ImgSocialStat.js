import React, { Component } from 'react';

import { formatData, findInFavorites } from '../../../../actions/appAddsAction';

import { withStyles } from '@material-ui/core/styles';
import imgSocialStat from './ImgSocialStat.style';

import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';

import Chat from '@material-ui/icons/Chat';
import Pageview from '@material-ui/icons/Pageview';
import GetApp from '@material-ui/icons/GetApp';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';


const styles = imgSocialStat;


class ImgSocialStat extends Component {
  render() {
    const {
      img,
      imgIndex,
      favorites,
      classes,
      auth,
      componentType,
    } = this.props;

    let _isFavorite = findInFavorites(img.id, favorites, auth.isAuthenticated())

    return (
      <CardActions className={classes.cardActions} disableActionSpacing>
        <IconButton
          className={classes.viewerIconButton}
          onClick={() => this.props.addToFavorites(imgIndex, ((componentType === 'favorites') ? 2 : 1))}
          title={!_isFavorite ? 'add to Favorites' : 'remove from Favorites'}
        >
          {!_isFavorite
            ? <StarBorderIcon className={classes.viewerIconStyle} />
            : <StarIcon className={classes.viewerIconStyle} />
          }
        </IconButton>
        <div className={classes.socialData}>
          {formatData((!_isFavorite ? img.favorites : (img.favorites + 1)))}
        </div>
        <IconButton
          className={classes.viewerIconButton}
          title='read at Pixabay'
          href={img.pageURL}
          target='_blank'
        >
          <Chat className={classes.viewerIconStyle} />
        </IconButton>
        <div className={classes.socialData}> {formatData(img.comments)} </div>
        <IconButton
          className={classes.viewerIconButton}
          title='see at Pixabay'
          href={img.pageURL}
          target='_blank'
        >
          <Pageview className={classes.viewerIconStyle} />
        </IconButton>
        <div className={classes.socialData}> {formatData(img.views)} </div>
        <IconButton
          className={classes.viewerIconButton}
          title='download from Pixabay'
          href={img.pageURL}
          target='_blank'
        >
          <GetApp className={classes.viewerIconStyle} />
        </IconButton>
        <div className={classes.socialData}> {formatData(img.downloads)} </div>
      </CardActions>
    );
  }
}

export default withStyles(styles)(ImgSocialStat)