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
} from '../actions/searchAction';
import { fetchViewerOpen } from '../actions/imgViewerAction';
import { addToFavorites, authDialogOpen, formatData, findInFavorites } from '../actions/appAddsAction';

import ImgViewer from './ImageViewer';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';

import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Close from '@material-ui/icons/Close';

const styles = {
  rootComponent: {
    position: 'relative',
    top: 57,
    display: 'block',
    margin: '0px 1px',
    overflow: 'hidden',
  },
  barTitleTag: {
    paddingRight: '0.35em',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#eee',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  exceededLimitMessage: {
    margin: '10px 0',
    color: '#d50000',
    fontSize: '2em',
    width: '100%',
    textAlign: 'center',
  },
  gridList: {
    justifyContent: 'space-around',
    margin: '0px !important',
  },
  gridListTile: {
    padding: '0px !important',
    border: '2px solid rgba(0, 0, 0, 0)',
    borderRadius: '2px',
    transition: 'all 0.1s ease',
    '&:hover': {
      border: '2px solid rgba(0, 0, 0, 0.75)',
    },
    '&:hover .gridListTileBar': {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
  },
  gridImg: {
    cursor: 'zoom-in',
  },
  gridListTileBarRoot: {
    height: 54,
    transition: 'all 0.1s ease',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxSizing: 'border-box',
    bottom: 0,
    width: '100%',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridListTileBarText: {
    marginLeft: 12,
    marginRight: 7,
    color: '#fff',
    overflow: 'hidden',
    flexGrow: '0',
    width: '100%',
  },
  gridListTileBarTitle: {
    fontSize: '1em',
    lineHeight: '1.2em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  gridListTileBarSubtitle: {
    fontSize: '0.75em',
    lineHeight: '1.2em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  iconButtonWrap: {
    display: 'flex',  
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton:{
    width: '3em',
    height: '3em',
    fontSize: '0.8em',
    paddingRight: 4, 
    flexGrow: '0',
  },
  icon: {
    fontSize: '2em',
    color: '#fff',
    transition: 'all 0.1s linear',
    '&:hover': {
      fontSize: '3em',
    },
  },
  loadingBarRoot: {
    width: '100vw',
    textAlign: 'center',
  },
  loadingBarProgress: {
    margin: '10px 0',
    color: 'rgb(38, 50, 56)',
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
  socialData: {
    color: '#fff',
    fontSize: '1.2em',
    flexGrow: '0',
    marginRight: '-3px',
    float: 'right',
  },
  waitApiResponseImages: {
    display: 'flex',
    height: '80vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadPreviousImagesRoot: {
    position: 'absolute',
    top: '0.8em',
    left: 0,
    right: 0,
    margin: '0 auto',
    width: '55%',
    maxWidth: 300,
    minWidth: 250,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    transition: 'all 0.5s ease',
    animation: 'loadPreviousImagesButton 0.5s ease-in',
  },
  loadPreviousImagesButton: {
    width: '90%',
    height: '100%',
    transition: 'all 0.25s ease',
    backgroundColor: 'rgba(255,235,59,0.95)',
    borderRadius: 2,
    boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
    fontSize: 19,
    '&:hover' : {
      backgroundColor: 'rgba(255,235,59,1)',
      color: 'rgba(0,0,0,0.7)',
    }
  },
  loadPreviousImagesCloseButton: {
    width: '1em',
    height: '1em',
    margin: '-0.5em 0 0 -0.5em',
    alignSelf: 'start',
    '& > span': {
      backgroundColor: 'rgba(38, 50, 56, 0.8)',
      width: '1em',
      height: '1em',
      borderRadius: '50%', 
      margin: '0 auto',
    },
    '& > span > svg': {
      fill: '#fff',
      width: '0.7em',
      height: '0.7em',
    },
    '&:hover': {
      '& > span': {
        backgroundColor: 'rgba(38, 50, 56, 1)',
      },
      '& > span > svg': {
        fill: 'rgba(255,235,59,1)',
      },
    }
  },
  loadPreviousImagesCloseButtonMobile: {
    width: '2em',
    height: '2em',
    margin: '-1em 0 0 -1em',
  }
};

// for calculating whole document height & windowHeight (in handleScroll())
const body = document.body;
const html = document.documentElement; 
let docHeight;
const updateDocHeightVar = () => { docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)}



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
      favorites,
      classes,
      auth,
    } = this.props;
    
    let _isFavorite = findInFavorites(img.id, favorites, auth.isAuthenticated())

    let _tagsArray;
    // check divider type in img.tags property (',' or ' ' ) and convert tags string to array
    (img.tags.split(',').length > 1)
      ? (_tagsArray = img.tags.split(','))
      : (_tagsArray = img.tags.split(' '))

    const imgTags = (
      <div className={classes.gridListTileBarTitle}>
        {
          _tagsArray.map((tag, tagIndex) => (
            <span
              className={classes.barTitleTag}
              key={tagIndex}
              title={`search for '${tag.trim()}'`}
              onClick={() => this.handleOnTagClick(tag.trim())}
            >
              #{tag.trim()}
            </span>
          ))
        }
      </div>
    )

    const imgAuthor = (
      <div className={classes.gridListTileBarSubtitle}>
        <span>
          by: <a 
                className={classes.barTitleTag}
                href={`https://pixabay.com/users/${img.user}-${img.user_id}/`}
                target='_blank'
                title={`'${img.user}' profile at Pixabay`}
              >
                {img.user}
              </a>
        </span>
      </div>
    )

    const imgFavoritesQty = (
      <div>
        <span className={classes.socialData}>
          {formatData((!_isFavorite ? img.favorites : (img.favorites + 1)))}
        </span>
      </div>
    )

    const imgFavoritesButton = (
      <IconButton
        className={classes.iconButton}
        onClick={() => auth.isAuthenticated() ? this.props.addToFavorites(imgIndex) : this.props.authDialogOpen()}
        title={!_isFavorite ? 'add to Favorites' : 'remove from Favorites'}
      >
        {!_isFavorite ? <StarBorderIcon className={classes.icon} /> : <StarIcon className={classes.icon} />}
      </IconButton>
    )

    return (
      <div className={classes.gridListTileBarRoot}>
        <div className={classes.gridListTileBarText}>
          {imgTags}
          {imgAuthor}
        </div>
        {imgFavoritesQty}
        {imgFavoritesButton}
      </div>
    );
  }
}



class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoadPreviousImagesButton: true,
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
    // show Login dialog if user isn't authenticated and due to that was redirected from other pages
    (this.props.location.state !== undefined)
      ? setTimeout(() => this.props.authDialogOpen(), 500)
      : null
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
      ? this.props.fetchViewerOpen(true, ((Number(match.params.viewer) - 1)-(page * amount - amount)), this.props.auth.isAuthenticated())
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
    this.props.fetchViewerOpen(true, index, this.props.auth.isAuthenticated());
    (this.props.page === 1) ? (setTimeout(() => {this.updateSearchPath()}, 100)) : null;
  }
  

  render() {
    let searchResponse,
        _cellHeight,
        _gridCols;

    const { 
      images,
      totalHits,
      searchText,
      amount,
      page,
      classes,
      width,
      mobileWithTouch,
      waitApiResponseImages,
      waitApiResponseMoreImages,
      windowTop,
      match,
      auth,
      orientation,
      open,
      history,
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
          <div className={`${classes.loadPreviousImagesRoot} ${windowTop ? null : 'hidden'}`}>
            <IconButton
              classes={{root: classes.loadPreviousImagesButton,}}
              onClick={() => { this.props.fetchMoreImages(false, false, (match.params.page - 1)) }}
              title='load previous images'
            >
              <ArrowUpward />
              <span> load previous images </span>
              {(width !== 'xs') ? <ArrowUpward /> : null}
            </IconButton>
            <IconButton
              className={`${classes.loadPreviousImagesCloseButton} ${mobileWithTouch ? classes.loadPreviousImagesCloseButtonMobile : null}`}
              onClick={() => this.setState({ showLoadPreviousImagesButton: false })}
              disableRipple
              title='close'
              size='large'
            >
              <Close />
            </IconButton>
          </div>
        )
      } else {
        return (
          _loadingIcon
        )
      }
    };
    

    if (orientation === 'vertical') {
      _cellHeight = 270;
      switch (true) {
        case (width === 'xl'):
          _gridCols = 8
          break;
        case (width === 'lg'):
          _gridCols = 6
          break;
        case (width === 'md'):
          _gridCols = 4
          break;
        case (width === 'sm'):
          _gridCols = 3
          break;
        default:
          _gridCols = 2
          break;
      }
    } else {
      _cellHeight = 180;
      switch (true) {
        case (width === 'xl'):
          _gridCols = 5
          break;
        case (width === 'lg'):
          _gridCols = 4
          break;
        case (width === 'md'):
          _gridCols = 3
          break;
        case (width === 'sm'):
          _gridCols = 2
          break;
        default:
          _gridCols = 1
          break;
      }
    }


    // define if images from API was loaded not from the 1st page
    let _notFromFirstPage = (Math.ceil(images.length / amount) < page)


    const imagesResults = (
      <div>
        {(_notFromFirstPage && this.state.showLoadPreviousImagesButton) ? _loadPreviousImagesOption() : null}
        <GridList
          className={classes.gridList}
          cols={_gridCols}
          cellHeight={_cellHeight}
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
                {...this.props}
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
  addToFavorites: PropTypes.func.isRequired,
  authDialogOpen: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  totalHits: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  orientation: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
  favorites: PropTypes.array,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  mobileWithTouch: PropTypes.bool,
  waitApiResponseImages: PropTypes.bool,
  waitApiResponseMoreImages: PropTypes.object,
  currentImgInd: PropTypes.number,
  windowTop: PropTypes.bool,
}

const mapStateToProps = state => ({
  images: state.search.images,
  totalHits: state.search.total,
  page: state.search.page,
  orientation: state.search.orientation,
  open: state.imgViewer.open,
  searchText: state.search.searchText,
  favorites: state.appAdds.favorites,
  mobileWithTouch: state.appAdds.mobileWithTouch,
  waitApiResponseImages: state.search.waitApiResponseImages,
  waitApiResponseMoreImages: state.search.waitApiResponseMoreImages,
  order: state.search.order,
  imageType: state.search.imageType,
  category: state.search.category,
  color: state.search.color,
  amount: state.search.amount,
  currentImgInd: state.imgViewer.currentImgInd,
  windowTop: state.appAdds.windowTop,
})

const mapDispatchToProps = {
  fetchImages,
  fetchMoreImages,
  fetchPage,
  fetchViewerOpen,
  cutDownSearchStore,
  addToFavorites,
  fetchSearchText,
  fetchAmount,
  fetchOrder,
  fetchCategory,
  fetchColor,
  fetchImageType,
  fetchOrientation,
  authDialogOpen,
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles), withWidth(), )(SearchResults))