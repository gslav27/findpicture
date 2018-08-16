import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import imgTagsStyle from './ImgTags.style';

import CardContent from '@material-ui/core/CardContent';


const styles = theme => (imgTagsStyle(theme));


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

export default compose(withStyles(styles), withWidth(),)(ImgTags)