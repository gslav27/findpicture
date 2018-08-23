import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchImages, fetchPage, fetchSearchText } from '../../actions/searchAction';
import { addToFavorites } from '../../actions/appAddsAction';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import userOptionTemplate from './UserOptionTemplate.style';

import ImgTags from './components/ImgTags/ImgTags';
import ImgSocialStat from './components/ImgSocialStat/ImgSocialStat';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => (userOptionTemplate(theme));


class UserOptionTemplate extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0);
  }

  render() {
    let imageListContent,
        imagesData,
        noMatchesText;

    const { 
      classes, 
      ...otherProps
    } = this.props;
    
    switch (this.props.componentType) {
      case "favorites":
        imagesData = this.props.favorites;
        noMatchesText = `unfortunately you haven't add any images to Favorites`;
        break;
      case "recentlyWatched":
        imagesData = this.props.recentlyWatchedImgs;
        noMatchesText = `unfortunately you haven't watched any images yet`;
        break;
      default:
        break;
    }


    const imagesResults = (
      imagesData.map((img, index) => {
        return (
          <div key={img.id}>
            <Card className={classes.card}>
              <CardHeader
                className={classes.cardHeader}
                avatar={
                  <Avatar>
                    <img src={img.userImageURL} alt={null} />
                  </Avatar>
                }
                title={
                  <a className={classes.barTitleTag}
                    href={`https://pixabay.com/users/${img.user}-${img.user_id}/`}
                    target='_blank'
                    title={`'${img.user}' profile at Pixabay`}
                  >
                    {img.user}
                  </a>
                }
              />
              <CardMedia
                className={classes.cardMedia}
                component='img'
                src={`https://findpicture-6dee.restdb.io/media/${img.id}`}
                title={img.tags}
              />
              <ImgTags
                tagsData={img.tags}
                {...otherProps}
            />
              <ImgSocialStat
                img={img}
                imgIndex={index}
                {...otherProps}
              />
            </Card>
            <br className={classes.cardDivider} />
          </div>
        )
      })
    )


    const waitResponse = (
      <div className={classes.waitApiResponseImages}>
        <div className={classes.loadingBarRoot} >
          <CircularProgress
            className={classes.loadingBarProgress}
            size={50}
          />
        </div >
      </div>
    )


    const noMatches = (
      <div className={classes.noMatchesWrapper}>
        <div className={classes.noMatches}>
          {noMatchesText}
        </div>
      </div>
    )


    if (this.props.waitApiResponseUserHistory) {
      imageListContent = waitResponse
    } else if (imagesData.length) {
      imageListContent = imagesResults
    } else {
      imageListContent = noMatches
    }


    return (
      <div className={classes.rootComponent}>
        {imageListContent}
      </div>
    )
  }
}

UserOptionTemplate.propTypes = {
  fetchImages: PropTypes.func,
  fetchPage: PropTypes.func,
  fetchSearchText: PropTypes.func,
  addToFavorites: PropTypes.func,
  recentlyWatchedImgs: PropTypes.array,
  favorites: PropTypes.array,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  waitApiResponseUserHistory: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  recentlyWatchedImgs: state.appAdds.recentlyWatchedImgs,
  favorites: state.appAdds.favorites,
  waitApiResponseUserHistory: state.appAdds.waitApiResponseUserHistory,
})

const mapDispatchToProps = {
  addToFavorites,
  fetchImages,
  fetchPage,
  fetchSearchText,
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles), withWidth(), )(UserOptionTemplate))