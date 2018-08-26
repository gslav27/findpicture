import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';

import { 
  fetchImages, 
  fetchMoreImages,
  cutDownSearchStore,
  fetchAmount,
  fetchOrder,
  fetchCategory,
  fetchColor,
  fetchImageType,
  fetchOrientation,
  fetchPage,
  fetchSearchText,
} from '../../actions/searchAction';
import { fetchViewerOpen } from '../../actions/imgViewerAction';

import ImgViewer from '../ImageViewer/ImageViewer';
import ImgCaption from './components/ImgCaption/ImgCaptions';
import LoadPreviousImagesButton from './components/LoadPreviousImagesButton/LoadPreviousImagesButton';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import searchResultsStyle from './SearchResults.styles';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CircularProgress from '@material-ui/core/CircularProgress';

import { auth } from '../Auth/AuthHOC';

const styles = (theme) => (searchResultsStyle(theme))


// for calculating whole document height & windowHeight (in handleScroll())
const body = document.body;
const html = document.documentElement; 
let docHeight;
const updateDocHeightVar = () => { docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)}

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
    this.handleSearchPath = this.handleSearchPath.bind(this);
    this.updateSearchPath = this.updateSearchPath.bind(this);
  } 


  componentDidMount() {
    // handle URL location if search options already specified (if its someones link, page was reloaded, etc)
    let { params } = this.props.match;
    (params.query !== undefined) ? this.handleSearchPath(params.query) : this.updateSearchPath();
    (params.page !== undefined) ? this.props.fetchImages(Number(params.page)) : (this.props.fetchAmount(this.props.width), this.props.fetchImages());

    // calculate document height variable (global)
    updateDocHeightVar();

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
      let userPosition = window.pageYOffset / docHeight;
      return userPosition;
    }
    // return docHeight before previous images was loaded (for user position correcting)
    if ((images.length !== prevProps.images.length) && (waitApiResponseMoreImages.previous !== prevProps.waitApiResponseMoreImages.previous)) {
      return docHeight
    }
    return null;
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {
    // update document height variable (global)
    updateDocHeightVar();
    const {
      images,
      searchText,
      order,
      orientation,
      imageType,
      category,
      color,
      page,
      amount,
      width,
      waitApiResponseMoreImages,
      open,
      waitApiResponseImages,
      match,
    } = this.props;
    // set correct user position if width was changed
    if (width !== prevProps.width) {
      // forceUpdate with timeout is needed for correct calculation of images fit (inside GridListTile) & user position
      setTimeout(() => {
        let userPosition = snapshot * docHeight;
        window.scrollTo(0, userPosition);
        this.forceUpdate();
      }, 100);
    }
    // update URL location on fetching user input, filter changes
    if (
      !open && ((searchText !== prevProps.searchText) || 
      (order !== prevProps.order) || 
      (orientation !== prevProps.orientation) || 
      (imageType !== prevProps.imageType) || 
      (category !== prevProps.category) || 
      ((color.length !== prevProps.color.length) || (color[0] !== prevProps.color[0])) || 
      (page !== prevProps.page))
    ) {
      this.updateSearchPath();
    }
    // update URL location when user click on 'Home' button (in Drawer) from 'SearchResults'-page (from Home page)
    ((prevProps.match.params.query !== undefined) && (this.props.location.pathname === '/findpicture/'))
      ? this.updateSearchPath()
      : null;
    // set correct user position after loading previous images
    ((images.length !== prevProps.images.length) && (waitApiResponseMoreImages.previous !== prevProps.waitApiResponseMoreImages.previous))
      ? window.scrollBy(0, (docHeight-snapshot))
      : null;
    // update URL location (using handleScroll() option) after Image Viewer was closed or next images was loaded
    (((open !== prevProps.open) && !open) || ((waitApiResponseMoreImages.next !== prevProps.waitApiResponseMoreImages.next) && !waitApiResponseMoreImages.next))
      ? this.handleScroll()
      : null;
    // open Image Viewer if URL location have data about some opened images (in this.props.match.params.viewer) and application just loaded (waitApiResponseImages checking)
    ((waitApiResponseImages !== prevProps.waitApiResponseImages) && !waitApiResponseImages && (match.params.viewer !== undefined))
      ? this.props.fetchViewerOpen(true, ((Number(match.params.viewer) - 1)-(page * amount - amount)), auth.isAuthenticated())
      : null;
  }


  handleSearchPath = (searchPath) => {
    // searchPath is part of URL, for example:
    // URL = 'findpicture/q_sky&order=latest&color=green,red&q=30'
    // searchPath = 'sky&order=latest&color=green,red&q=30'
    let searchParameters = searchPath.split('&'); // searchParameters = [ 'sky', 'order=latest', 'color=green,red', 'q=30' ]
    searchParameters.forEach((parameter, index) => {
      let filter = parameter.split('='); 
      if (filter.length === 1) {                  
        (index === 0) ? this.props.fetchSearchText(filter[0]) : null; // filter = ['sky']
      } else {
        if (filter[0] === 'q') {                                      // filter = ['q=30']
          this.props.fetchAmount(null, Number(filter[1]));
        } else {                                                      // filter = ['order=latest'] or ['color=green,red']
          let filterHandler = 'fetch' + filter[0][0].toUpperCase() + filter[0].slice(1);
          let filterValue = (filter[0] !== 'color') ? filter[1] : (filter[1]).split(',');
          this.props[filterHandler](filterValue);
        }
      }
    })
  }


  updateSearchPath = () => {
    const {
      searchText,
      order,
      orientation,
      imageType,
      category,
      color,
      page,
      amount,
      history,
      match,
    } = this.props;
    
    // create new string which could be used for URL location update if there are custom search query
    let customFilterValues = '';
    // check if search query options isn't default and update 'customFilterValues' if its true
    (searchText !== '') ? (customFilterValues += searchText) : null;
    (order !== 'popular') ? (customFilterValues += '&order=' + order) : null;
    (orientation !== 'horizontal') ? (customFilterValues += '&orientation=' + orientation) : null;
    (imageType !== 'photo') ? (customFilterValues += '&imageType=' + imageType) : null;
    (category !== '') ? (customFilterValues += '&category=' + category) : null;
    (color[0] !== null) ? (customFilterValues += '&color=' + color) : null;
    if ((page === 1) && (match.params.viewer !== undefined)) {
      customFilterValues += '&q=' + amount + '/' + page
    } else if ((page !== 1) || (match.params.viewer !== undefined)) {
      customFilterValues += '&q=' + amount + '/' + page
    }
    (match.params.viewer !== undefined) ? (customFilterValues += '/' + match.params.viewer) : null;

    // check if there are custom search query and update URL location if its true
    if (customFilterValues !== '') {
      let historyPath = '/findpicture/q_' + customFilterValues;
      history.push(historyPath);
    } else {
      history.push('/findpicture');
    }
  }


  handleScroll() {
    const { page, amount, images, totalHits, history, match, waitApiResponseMoreImages } = this.props;
    // get height of the window 
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    // calcualte path page height (*/*/:page?)
    const pathPageHeight = docHeight / (images.length / amount);
    // calculate currentWindowYOffset
    const windowYOffset = window.pageYOffset + (windowHeight - 200);

    // calculate currentPathPageYOffset parameters (for setting current page in URL on scroll)
    let currentPathPageStart,
        currentPathPageEnd;
    let currentPathPage = Number((match.params.page !== undefined) ? match.params.page : 1);
    // set currentPathPage start&end bounds depends on number of loaded pages from API
    const fetchedPages = Math.ceil(images.length / amount)
    if (fetchedPages === page) { // pages from API was loaded from the 1st page
      currentPathPageStart = pathPageHeight * (currentPathPage - 1);
    } else {
      currentPathPageStart = pathPageHeight * (currentPathPage - 1 - (page - fetchedPages))
    }
    currentPathPageEnd = currentPathPageStart + pathPageHeight;
    let pathQuery = (match.params.query === undefined) ? '' : match.params.query;
    // change URL page parameter only when Image Viewer is closed
    if (!this.props.open) {
      if ((windowYOffset > currentPathPageEnd)) {
        let newPath = `/findpicture/q_${pathQuery}/${currentPathPage + 1}`;
        history.push(newPath);
      } else if (windowYOffset < currentPathPageStart) {
        let newPath = `/findpicture/q_${pathQuery}/${currentPathPage - 1}`;
        history.push(newPath);
      } else if (match.params.viewer !== undefined) {
        let newPath = `/findpicture/q_${pathQuery}/${currentPathPage}`;
        history.push(newPath);
      }
    }

    // add new page if there are more images in Pixabay API and user scrolls to the document bottom
    if ((totalHits > images.length) && ((amount * page) < totalHits) && (!this.props.waitApiResponseImages)) {
      // calculate bottom of window
      const windowBottom = windowHeight + window.pageYOffset;
      // add more images if window bottom is less then 60px to document bottom
      if (((windowBottom - docHeight) > -60) && !waitApiResponseMoreImages.next) {
        this.props.fetchPage(this.props.page + 1);
        this.props.fetchMoreImages();
      }
    }
  };


  handleImgOpen = (index) => {
    this.props.fetchViewerOpen(true, index, auth.isAuthenticated());
    (this.props.page === 1) ? (setTimeout(() => {this.updateSearchPath()}, 100)) : null;
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
      orientation,
      open,
      history,
      ...otherProps,
    } = this.props;


    const _loadingIcon = (
      < div className={classes.loadingBarRoot} >
        <CircularProgress className={classes.loadingBarProgress} size={50}/>
      </div >
    );


    const _moreImagesLoadingIcon = () => {
      switch (true) {
        // define if there are more images in Pixabay API and show loading icon if its true.
        // (images.length < 500) is because Pixabay API return max 500 images per 1 search query
        case ((totalHits > images.length) && (images.length < 500) && ((amount * page) < totalHits)):
          return _loadingIcon
        
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
      return _loadingIcon
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


    const waitResponse = (
      <div className={classes.waitApiResponseImages}>
        {_loadingIcon}
      </div>
    )


    const noMatches = (
      <div className={classes.noMatchesWrapper}>
        <div className={classes.noMatches}>
          no matches for "{searchText}"
        </div>
      </div>
    )


    const imageViewer = (
      <ImgViewer 
        match={match} 
        history={history}
        auth={auth}
      />
    )

    
    if (waitApiResponseImages) {
      searchResponse = waitResponse
    } else if (images.length) {
      searchResponse = imagesResults
    } else if (searchText) {
      searchResponse = noMatches
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
  fetchImages: PropTypes.func.isRequired,
  fetchMoreImages: PropTypes.func.isRequired,
  fetchPage: PropTypes.func.isRequired,
  fetchViewerOpen: PropTypes.func.isRequired,
  fetchSearchText: PropTypes.func.isRequired,
  fetchAmount: PropTypes.func.isRequired,
  fetchOrder: PropTypes.func.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  fetchColor: PropTypes.func.isRequired,
  fetchImageType: PropTypes.func.isRequired,
  fetchOrientation: PropTypes.func.isRequired,
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
  currentImgInd: PropTypes.number,
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
  order: state.search.order,
  imageType: state.search.imageType,
  category: state.search.category,
  color: state.search.color,
  amount: state.search.amount,
  currentImgInd: state.imgViewer.currentImgInd,
})

const mapDispatchToProps = {
  fetchImages,
  fetchMoreImages,
  fetchPage,
  fetchViewerOpen,
  cutDownSearchStore,
  fetchSearchText,
  fetchAmount,
  fetchOrder,
  fetchCategory,
  fetchColor,
  fetchImageType,
  fetchOrientation,
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles), withWidth(), )(SearchResults))