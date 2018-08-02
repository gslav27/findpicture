import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { fetchImages, fetchPage, fetchSearchText } from '../actions/searchAction';
import { addToFavorites, formatData, findInFavorites } from '../actions/appAddsAction';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import Chat from '@material-ui/icons/Chat';
import Pageview from '@material-ui/icons/Pageview';
import GetApp from '@material-ui/icons/GetApp';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
  barTitleTag: {
    display: 'inline-block',
    paddingRight: '0.35em',
    textDecoration: 'none',
    color: '#333',
    '&:hover': {
      backgroundColor: '#ddd',
      borderRadius: 2,
    },
  },
  card: {
    padding: '5px 0px',
  },
  cardActions: {
    padding: '0px 4px 4px',
  },
  cardDivider: {
    display: 'block',
    [theme.breakpoints.only('xs')]: {
      display: 'none',
    },
  },
  cardHeader: {
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
  },
  cardMedia: {
    width: '100%',
    maxHeight: '90vh',
    objectFit: 'scale-down',
  },
  cardContent: {
    padding: '0.8em 16px 0 16px',
  },
  loadingBarRoot: {
    width: '100vw',
    textAlign: 'center',
  },
  loadingBarProgress: {
    margin: '10px 0',
    color: 'rgb(38, 50, 56)',
  },
  waitApiResponseImages: {
    display: 'flex',
    height: '80vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMatchesWrapper: {
    display: 'flex',
    posititon: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '80vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMatches: {
    width: '90vw',
    textAlign: 'center',
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#aaa',
  },
  rootComponent: {
    position: 'relative',
    top: 67,
    display: 'block',
    margin: 'auto',
    color: '#550',
    width: '70%',
    [theme.breakpoints.only('xs')]: {
      top: 57,
      width: '100%',
    },
  },
  socialData: {
    color: '#333',
    fontSize: '0.95em',
    marginLeft: '-7px',
  },
  viewerIconButton: {
    maxHeight: '10vh',
  },
  viewerIconStyle: {
    color: '#333',
    height: '1.3em',
    width: '1.3em',
  },
});



class ImgTags extends Component {
  handleOnTagClick = (tag) => {
    this.props.fetchSearchText(tag);
    this.props.fetchPage(1);
    this.props.fetchImages();
  }

  render() {
    let { tagsData, classes } = this.props;
    let _tagArray;
    // check divider type in tagsData (',' or ' ' ) and convert tags string to array
    (tagsData.split(',').length > 1)
      ? (_tagArray = tagsData.split(','))
      : (_tagArray = tagsData.split(' '))

    return (
      <CardContent className={classes.cardContent}>
        {
          _tagArray.map((tag, tagIndex) => (
            <Link 
              to='/findpicture/'
              className={classes.barTitleTag}
              key={tagIndex}
              title={`search for '${tag.trim()}'`}
              onClick={() => this.handleOnTagClick(tag.trim())}
            >
              #{tag.trim()}
            </Link>
          ))
        }
      </CardContent>
    )
  }
}



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



class UserOptionTemplate extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0);
  }

  render() {
    let imageListContent,
        imagesData,
        noMatchesText;

    const { componentType, favorites, recentlyWatchedImgs, classes, waitApiResponseUserHistory } = this.props;
    
    switch (true) {
      case (componentType === 'favorites'):
        imagesData = favorites;
        noMatchesText = `unfortunately you haven't add any images to Favorites`
        break;
      case (componentType === 'recentlyWatched'):
        imagesData = recentlyWatchedImgs;
        noMatchesText = `unfortunately you haven't watched any images yet`
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
                {...this.props}
              />
              <ImgSocialStat
                img={img}
                imgIndex={index}
                {...this.props}
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


    if (waitApiResponseUserHistory) {
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