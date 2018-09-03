import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';

import ImgTags from '../UI/ImgTags';
import ImgSocialStat from '../UI/ImgSocialStat';
import { WaitResponse, NoImages } from '../UI/FetchingApiResponse/FetchingApiResponse';

import userOptionTemplate from './UserOptionTemplate.style';


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
      componentType,
    } = this.props;

    
    switch (componentType) {
      case 'favorites':
        imagesData = this.props.favorites;
        noMatchesText = `unfortunately you haven't add any images to Favorites`;
        break;
      case 'recentlyWatched':
        imagesData = this.props.recentlyWatchedImgs;
        noMatchesText = `unfortunately you haven't watched any images yet`;
        break;
      default:
        break;
    }


    const imagesResults = (
      imagesData.map((img, index) => (
        <div key={img.id}>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              avatar={(
                <Avatar>
                  <img src={img.userImageURL} alt={`${img.user} avatar`} />
                </Avatar>
              )}
              title={(
                <a
                  className={classes.barTitleTag}
                  href={`https://pixabay.com/users/${img.user}-${img.user_id}/`}
                  target='_blank'
                  title={`'${img.user}' profile at Pixabay`}
                >
                  {img.user}
                </a>
              )}
            />
            <CardMedia
              className={classes.cardMedia}
              component='img'
              src={`https://findpicture-6dee.restdb.io/media/${img.id}`}
              title={img.tags}
            />
            <CardContent
              className={classes.cardContent}
              children={
                <ImgTags tagsData={img.tags} />
              }
            />
            <CardActions
              className={classes.cardActions}
              disableActionSpacing
              children={(
                <ImgSocialStat
                  img={img}
                  imgIndex={index}
                  componentType={componentType}
                />
              )}
            />
          </Card>
          <br className={classes.cardDivider} />
        </div>
      ))
    );


    if (this.props.waitApiResponseUserHistory) {
      imageListContent = <WaitResponse />;
    } else if (imagesData.length) {
      imageListContent = imagesResults;
    } else {
      imageListContent = <NoImages children={noMatchesText} />;
    }


    return (
      <div className={classes.rootComponent}>
        {imageListContent}
      </div>
    );
  }
}

UserOptionTemplate.propTypes = {
  recentlyWatchedImgs: PropTypes.array,
  favorites: PropTypes.array,
  classes: PropTypes.object.isRequired,
  waitApiResponseUserHistory: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  recentlyWatchedImgs: state.appAdds.recentlyWatchedImgs,
  favorites: state.appAdds.favorites,
  waitApiResponseUserHistory: state.appAdds.waitApiResponseUserHistory,
});

export default connect(mapStateToProps, {})(compose(withStyles(styles), withWidth())(UserOptionTemplate));
