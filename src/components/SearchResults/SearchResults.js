import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';

import { 
  fetchMoreImages,
  cutDownSearchStore,
  fetchPage,
  fetchSearchText,
} from '../../actions/searchAction';
import { fetchViewerOpen } from '../../actions/imgViewerAction';

import ImgViewer from '../ImageViewer/ImageViewer';
import ImgCaption from './components/ImgCaption/ImgCaptions';
import LoadPreviousImagesButton from './components/LoadPreviousImagesButton/LoadPreviousImagesButton';
import { LoadingIcon, WaitResponse, NoImages } from '../UI/FetchingApiResponse/FetchingApiResponse';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import searchResultsStyle from './SearchResults.styles';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import { auth } from '../Auth/AuthHOC';


import withSearchPathHandler from '../SearchPathHandler/SearchPathHandlerHOC';

const styles = (theme) => (searchResultsStyle(theme))


// for calculating whole document height & windowHeight (in handleScroll())
const body = document.body;
const html = document.documentElement; 
const getDocHeight = () => Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

// define gridList parameters
let gridParams = {
  gridCols: {
    xl: [8, 5],
    lg: [6, 4],
    md: [4, 3],
    sm: [3, 2],
    xs: [2, 1]
  },
  cellHeight: [270, 180]
};


class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoadPreviousImagesButton: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollThrottled = throttle(this.handleScroll, 250);
  } 


  componentDidMount() {
    // define if images from API were loaded not from the 1st page and if it's 'true' make 
    // available showing LoadPreviousImagesButton when user is at the top of the page
    (Math.ceil(this.props.images.length / this.props.amount) < this.props.page)
      ? this.setState({ showLoadPreviousImagesButton: true })
      : null;

    window.addEventListener('scroll', this.handleScrollThrottled);
  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollThrottled);
    this.props.cutDownSearchStore();
  }


  getSnapshotBeforeUpdate(prevProps, prevState) {
    const { images, waitApiResponseMoreImages } = this.props;
    // return last user position (in % of docHeight) if width will be changed (for user position correcting)
    if (this.props.width !== prevProps.width) {
      let userPosition = window.pageYOffset / getDocHeight();
      return userPosition;
    }
    // return docHeight before previous images was loaded (for user position correcting)
    if ((images.length !== prevProps.images.length) && (waitApiResponseMoreImages.previous !== prevProps.waitApiResponseMoreImages.previous)) {
      return getDocHeight()
    }
    return null;
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const {
      images,
      width,
      waitApiResponseMoreImages,
    } = this.props;
    // set correct user position if width was changed
    if (width !== prevProps.width) {
      // forceUpdate with timeout is needed for correct calculation of images fit (inside GridListTile) & user position
      setTimeout(() => {
        let userPosition = snapshot * getDocHeight();
        window.scrollTo(0, userPosition);
        this.forceUpdate();
      }, 100);
    }
    // set correct user position after loading previous images
    ((images.length !== prevProps.images.length) && (waitApiResponseMoreImages.previous !== prevProps.waitApiResponseMoreImages.previous))
      ? window.scrollBy(0, (getDocHeight()-snapshot))
      : null;
  }


  handleScroll() {
    const { page, amount, images, totalHits, waitApiResponseMoreImages } = this.props;
    // add new page if there are more images in Pixabay API and user scrolls to the document bottom
    if ((totalHits > images.length) && ((amount * page) < totalHits) && (!this.props.waitApiResponseImages)) {
      // get height of the window 
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      // calculate bottom of window
      const windowBottom = windowHeight + window.pageYOffset;
      // add more images if window bottom is less then 60px to document bottom
      if (((windowBottom - getDocHeight()) > -60) && !waitApiResponseMoreImages.next) {
        this.props.fetchPage(this.props.page + 1);
        this.props.fetchMoreImages();
      }
    }
  };


  handleImgOpen = (index) => {
    this.props.fetchViewerOpen(true, index, auth.isAuthenticated());
  }


  defineGridListParams = (type) => {
    let { orientation, width } = this.props;
    if (orientation === 'vertical') {
      return type === 'cellHeight' ? gridParams.cellHeight[0] : gridParams.gridCols[width][0]
    }
    return type === 'cellHeight' ? gridParams.cellHeight[1] : gridParams.gridCols[width][1]
  }
  

  render() {
    let searchResponse;

    const { 
      images,
      totalHits,
      searchText,
      amount,
      page,
      classes,
      width,
      waitApiResponseImages,
      waitApiResponseMoreImages,
      match,
      open,
      history,
      ...otherProps
    } = this.props;


    const _moreImagesLoadingIcon = () => {
      switch (true) {
        // define if there are more images in Pixabay API and show loading icon if its true.
        // (images.length < 500) is because Pixabay API return max 500 images per 1 search query
        case ((totalHits > images.length) && (images.length < 500) && ((amount * page) < totalHits)):
          return <LoadingIcon />
        
        // define if its all images from Pixabay API
        case ((totalHits === images.length) || ((amount * page) > totalHits)):
          return null
        default:
          return <div className={classes.exceededLimitMessage}>API limit is exceeded</div> 
      }
    }

    const _loadPreviousImagesOption = () => {
      if (!waitApiResponseMoreImages.previous) {
        return (
          <LoadPreviousImagesButton 
            width={width}
            match={match}
            onCloseButtonClick={() => this.setState({ showLoadPreviousImagesButton: false })}
          />
      )}
      return <LoadingIcon />
    };

    
    const imagesResults = (
      <div>
        {this.state.showLoadPreviousImagesButton ? _loadPreviousImagesOption() : null}
        <GridList
          className={classes.gridList}
          cols={this.defineGridListParams()}
          cellHeight={this.defineGridListParams('cellHeight')}
        >
          {images.map((img, index) => (
            <GridListTile
              className={classes.gridListTile}
              key={index + '_' + img.id}
            >
              <img
                className={classes.gridImg}
                src={img.webformatURL}
                alt={img.tags}
                onClick={() => this.handleImgOpen(index)}
              />
              <ImgCaption
                img={img}
                imgIndex={index}
                {...otherProps}
              />
            </GridListTile >
          ))}
        </GridList>
        {_moreImagesLoadingIcon()}
      </div>
    )


    const imageViewer = <ImgViewer match={match} />

    
    if (waitApiResponseImages) {
      searchResponse = <WaitResponse />
    } else if (images.length) {
      searchResponse = imagesResults
    } else if (searchText) {
      searchResponse = <NoImages children={`no matches for "${searchText}"`}/>
    }


    return (
      <div className={classes.rootComponent}>
        {searchResponse}
        {open ? imageViewer : null}
      </div>
    )
  }
}


SearchResults.propTypes = {
  fetchMoreImages: PropTypes.func.isRequired,
  fetchPage: PropTypes.func.isRequired,
  fetchViewerOpen: PropTypes.func.isRequired,
  fetchSearchText: PropTypes.func.isRequired,
  cutDownSearchStore: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  totalHits: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  orientation: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  waitApiResponseImages: PropTypes.bool,
  waitApiResponseMoreImages: PropTypes.object,
}

const mapStateToProps = state => ({
  images: state.search.images,
  totalHits: state.search.total,
  page: state.search.page,
  orientation: state.search.orientation,
  open: state.imgViewer.open,
  searchText: state.search.searchText,
  waitApiResponseImages: state.search.waitApiResponseImages,
  waitApiResponseMoreImages: state.search.waitApiResponseMoreImages,
  amount: state.search.amount,
})

const mapDispatchToProps = {
  fetchMoreImages,
  fetchPage,
  fetchViewerOpen,
  cutDownSearchStore,
  fetchSearchText,
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles), withWidth(), )(withSearchPathHandler(SearchResults)))