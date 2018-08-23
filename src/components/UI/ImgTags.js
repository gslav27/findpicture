import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { fetchImages, fetchPage, fetchSearchText } from '../../actions/searchAction';

import { Link } from 'react-router-dom';



class ImgTags extends Component {
  getTagsArray = () => {
    let { tagsData } = this.props
    // check divider type in tagsData (',' or ' ' ) and convert tags string to array
    if (tagsData.split(',').length > 1) {
      return tagsData.split(',')
    } else {
      return tagsData.split(' ')
    }
  }

  handleOnTagClick = (tag) => {
    this.props.fetchSearchText(tag);
    this.props.fetchPage(1);
    this.props.fetchImages();
  }


  render() {
    let _tagArray = () => this.getTagsArray();

    return (  
      <div>
        {_tagArray().map((tag, tagIndex) => {
          let trimmedTag = tag.trim();
          return (
            <Link
              to="/findpicture/"
              className='barTitleTag'
              key={tagIndex}
              title={`search for '${trimmedTag}'`}
              onClick={() => this.handleOnTagClick(trimmedTag)}
            >
              #{trimmedTag}
            </Link>
        )})}
      </div>
    )
  }
}


ImgTags.propTypes = {
  fetchImages: PropTypes.func.isRequired,
  fetchPage: PropTypes.func.isRequired,
  fetchSearchText: PropTypes.func.isRequired,
  tagsData: PropTypes.string.isRequired
};
  
const mapDispatchToProps = {
  fetchImages,
  fetchPage,
  fetchSearchText,
}

export default connect(null, mapDispatchToProps)(ImgTags);