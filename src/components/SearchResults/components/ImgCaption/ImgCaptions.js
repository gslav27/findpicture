import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import ImgTags from '../../../UI/ImgTags';
import FavoritesButton from '../../../UI/FavoritesButton';

import imgCaptionsStyle from './ImgCaptions.style';


const styles = imgCaptionsStyle();


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
      classes,
    } = this.props;

    const imgTags = (
      <div className={classes.gridListTileBarTitle}>
        <ImgTags tagsData={img.tags} />
      </div>
    );

    const imgAuthor = (
      <div className={classes.gridListTileBarSubtitle}>
        <span>
          {'by: '}
          <a
            className={classes.barTitleTag}
            href={`https://pixabay.com/users/${img.user}-${img.user_id}/`}
            target='_blank'
            title={`'${img.user}' profile at Pixabay`}
          >
            {img.user}
          </a>
        </span>
      </div>
    );


    return (
      <div className={classes.gridListTileBarRoot}>
        <div className={classes.gridListTileBarText}>
          {imgTags}
          {imgAuthor}
        </div>
        <FavoritesButton
          img={img}
          imgIndex={imgIndex}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ImgCaption);
