import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { fetchImages, fetchPage, fetchSearchText } from '../../operations/searchOperations';



class ImgTags extends Component {
  getTagsArray = () => {
    const { tagsData } = this.props;
    // check divider type in tagsData (',' or ' ' ) and convert tags string to array
    if (tagsData.split(',').length > 1) {
      return tagsData.split(',');
    }
    return tagsData.split(' ');
  }

  handleOnTagClick = (tag) => {
    this.props.fetchSearchText(tag);
    this.props.fetchPage(1);
    this.props.fetchImages();
  }


  render() {
    const _tagArray = () => this.getTagsArray();

    return (
      <Fragment>
        {_tagArray().map((tag, tagIndex) => {
          const trimmedTag = tag.trim();
          return (
            <Link
              to='/findpicture/'
              className='barTitleTag'
              key={tagIndex}
              title={`search for '${trimmedTag}'`}
              onClick={() => this.handleOnTagClick(trimmedTag)}
            >
              #{trimmedTag}
            </Link>
          );
        })}
      </Fragment>
    );
  }
}


ImgTags.propTypes = {
  fetchImages: PropTypes.func.isRequired,
  fetchPage: PropTypes.func.isRequired,
  fetchSearchText: PropTypes.func.isRequired,
  tagsData: PropTypes.string.isRequired,
};
  
const mapDispatchToProps = {
  fetchImages,
  fetchPage,
  fetchSearchText,
};

export default connect(null, mapDispatchToProps)(ImgTags);
