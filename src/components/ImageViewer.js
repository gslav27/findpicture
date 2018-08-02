import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchMoreImages, fetchPage, } from '../actions/searchAction';
import { fetchViewerImg, fetchViewerOpen, fetchWaitNextData, } from '../actions/imgViewerAction';
import { addToFavorites, authDialogOpen, formatData, findInFavorites } from '../actions/appAddsAction';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Close from '@material-ui/icons/Close';
import Chat from '@material-ui/icons/Chat';
import Pageview from '@material-ui/icons/Pageview';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';


const styles = {
  backDrop: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    cursor: 'zoom-out',
  },
  moreImagesLoadingRoot: {
    zIndex: 10000,
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgLoadingRoot: {
    zIndex: 1499,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  moreImagesLoadingProgress: {
    color: '#eee',
  },
  socialData: {
    color: '#ccc',
    fontSize: '1.2em',
    marginLeft: '-6px',
  },
  dialogRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.84)',
  },
  dialogImg: {
    maxWidth: '80vw',
    maxHeight: '80vh',
    border: '2px solid #fff',
  },
  dialogPaperWidthSm: {
    maxWidth: '80vw',
  },
  imgCounter: {
    color: '#ccc',
    fontSize: '1em',
    paddingLeft: 12,
  },
  toolBar: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: '9vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  toolBarTop: {
    top: 0,
    justifyContent: 'space-between',
  },
  toolBarBottom: {
    bottom: 0,
    justifyContent: 'center',
    paddingRight: '10px',
  },
  viewerAdds: {
    position: 'fixed',
    zIndex: 1501,
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  viewerAddsNavigation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  viewerIconButtonLR: {
    display: 'block',
    boxSizing: 'border-box',
    width: '45vw',
    height: '40vh',
    padding: 3,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
    zIndex: 1502,
  },
  viewerIconButtonLabel: {
    width: '10vw',
  },
  viewerIconButtonLabelRight: {
    '& span': {
      float: 'right',
    },
  },
  viewerIconButton: {
    maxHeight: '10vh',
    padding: 1,
  },
  buttonsHover: {
    '&:hover svg': {
      maxWidth: '10vw',
      maxHeight: '10vh',
      height: '1.8em',
      width: '1.8em',
      transition: 'all 0.2s ease',
    },
  },
  viewerIconStyleLR: {
    width: '1.3em',
    height: '1.3em',
    maxHeight: 50,
    color: '#ccc',
  },
  viewerIconStyle: {
    color: '#ccc',
    height: '1.3em',
    width: '1.3em',
  },  
};



class ImgSocialStat extends Component {
  render() {
    const {
      currentImg,
      currentImgInd,
      favorites,
      classes,
      auth,
    } = this.props;

    let _isFavorite = findInFavorites(currentImg.id, favorites, auth.isAuthenticated())

    return (
      <div className={`${classes.toolBar} ${classes.toolBarBottom}`}>
        <IconButton
          className={`${classes.viewerIconButton} ${classes.buttonsHover}`}
          onClick={() => auth.isAuthenticated() ? this.props.addToFavorites(currentImgInd) : this.props.authDialogOpen()}
          title={!_isFavorite ? 'add to Favorites' : 'remove from Favorites'}
        >
          {!_isFavorite
            ? <StarBorderIcon className={classes.viewerIconStyle} />
            : <StarIcon className={classes.viewerIconStyle} />
          }
        </IconButton>
        <div className={classes.socialData}>
          {formatData((!_isFavorite ? currentImg.favorites : (currentImg.favorites + 1)))}
        </div>
        <IconButton
          className={`${classes.viewerIconButton} ${classes.buttonsHover}`}
          title='read at Pixabay'
          href={currentImg.pageURL}
          target='_blank'
        >
          <Chat className={classes.viewerIconStyle} />
        </IconButton>
        <div className={classes.socialData}> {formatData(currentImg.comments)} </div>
        <IconButton
          className={`${classes.viewerIconButton} ${classes.buttonsHover}`}
          title='see at Pixabay'
          href={currentImg.pageURL}
          target='_blank'
        >
          <Pageview className={classes.viewerIconStyle} />
        </IconButton>
        <div className={classes.socialData}> {formatData(currentImg.views)} </div>
      </div>
    );
  }
}



class LeftRightButtons extends Component {
  render() {
    const {
      mobileWithTouch,
      classes,
    } = this.props;

    return (
      <div className={classes.viewerAddsNavigation}>
        <IconButton
          onClick={() => this.props.onChange('left')}
          classes={{
            root: `${classes.viewerIconButtonLR} ${mobileWithTouch ? null : classes.buttonsHover}`,
            label: classes.viewerIconButtonLabel,
          }}
          disableRipple
          title='left'
        >
          <ChevronLeft className={classes.viewerIconStyleLR} />
        </IconButton>
        <IconButton
          onClick={() => this.props.onChange('right')}
          className={classes.viewerIconButtonLabelRight}
          classes={{
            root: `${classes.viewerIconButtonLR} ${mobileWithTouch ? null : classes.buttonsHover}`,
            label: classes.viewerIconButtonLabel,
          }}
          disableRipple
          title='right'
        >
          <ChevronRight className={classes.viewerIconStyleLR} />
        </IconButton>
      </div>
    );
  }
}




class ImgViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchStartX: null,
      touchStartY: null,
      touchStartTime: null,
      imgLoaded: false,
      imgLoadedTimeOutId: null,
    };
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.updateSearchPath = this.updateSearchPath.bind(this);
  }
  

  componentDidMount() {
    this.updateSearchPath();
    window.addEventListener('keydown', this.handleNextButton);
    if (this.props.mobileWithTouch) {
      window.addEventListener('touchstart', this.handleTouchStart);
      window.addEventListener('touchend', this.handleTouchEnd);
    }
  }


  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleNextButton);
    if (this.props.mobileWithTouch) {
      window.removeEventListener('touchstart', this.handleTouchStart);
      window.removeEventListener('touchend', this.handleTouchEnd);
    }
  }


  componentDidUpdate = (prevProps) => {
    const { currentImgInd, nextDataLoading } = this.props;
    if (currentImgInd !== prevProps.currentImgInd) {
      this.updateSearchPath();
    }
    if (nextDataLoading && (nextDataLoading !== prevProps.nextDataLoading)) {
      window.removeEventListener('keydown', this.handleNextButton);
    } else if (!nextDataLoading && (nextDataLoading !== prevProps.nextDataLoading)) {
      window.addEventListener('keydown', this.handleNextButton);
    }
  }


  updateSearchPath = () => {
    let { currentImgInd, images, page, amount, match, history, } = this.props;
    let historyPath = (match.params.query === undefined) ? ('/findpicture/q_&q=' + amount) : ('/findpicture/q_' + match.params.query);
    let currentImgNum = currentImgInd + 1 + (page - Math.ceil(images.length / amount)) * amount;
    (currentImgInd !== -1) ? (historyPath += '/' + Math.ceil(currentImgNum / amount) + '/' + currentImgNum) : null;
    history.push(historyPath); 
  }


  handleTouchStart = (e) => {
    this.setState({
      touchStartX: e.changedTouches[0].clientX,
      touchStartY: e.changedTouches[0].clientY,
      touchStartTime: new Date().getTime(),
    });
  }


  handleTouchEnd = (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;
    let distance = touchEndX - this.state.touchStartX;
    let elapsedTime = new Date().getTime() - this.state.touchStartTime;
    if ((Math.abs(touchEndY - this.state.touchStartY) <= 100) && (Math.abs(distance) >= 50) && (elapsedTime <= 2000)) {
      switch (true) {
        case (distance > 0):
          this.handleNextButton({}, 'left')
          break;
        case (distance < 0):
          this.handleNextButton({}, 'right')
          break;
        default:
          break;
      }  
    }
  }


  handleImgClose = () => {
    this.props.fetchViewerOpen(false, -1, this.props.auth.isAuthenticated());
  }


  handleNextButton = (e = { keyCode: 0, key: '' }, side) => {
    let { currentImgInd, images, totalHits, page, amount } = this.props;
    let nextArrInd;
    if ((side === 'right') || (e.key === 'ArrowRight') || (e.keyCode === 39)) {
      nextArrInd = currentImgInd + 1;
    } else if ((side === 'left') || (e.key === 'ArrowLeft') || (e.keyCode === 37)) {
      nextArrInd = currentImgInd - 1;
    } else return null

    if (nextArrInd > -1) {
      switch (true) {
        case (nextArrInd < images.length):
          this.props.fetchViewerImg(nextArrInd, this.props.auth.isAuthenticated());
          // in case of fast user's 'NextButton'-clicking clear timeOut from previous 'handleNextButton()' execution'
          (this.state.imgLoadedTimeOutId !== null) ? window.clearTimeout(this.state.imgLoadedTimeOutId) : null;
          // set timeOut for Circular Progress render on slow image loading
          this.setState({imgLoadedTimeOutId: setTimeout(() => this.setState({ imgLoaded: !this.state.imgLoaded }), 500)}); 
          break;
        case (nextArrInd === images.length):
          this.props.fetchWaitNextData(true);
          if (totalHits > images.length) {
            this.props.fetchPage(page + 1);
            this.props.fetchMoreImages(true);
          } else {
            this.handleImgClose()
          }
          break;
        default:
          break;
      }
    } else if (Math.ceil(images.length / amount) < page) {
      this.props.fetchWaitNextData(true);
      this.props.fetchMoreImages(true, false, (this.props.match.params.page - 1));
    } else {
      this.handleImgClose()
    }
  }  

  
  render() {
    const { 
      classes,
      mobileWithTouch,
      nextDataLoading,
      currentImgInd,
      totalHits,
      images,
      amount,
      page,
      open,
    } = this.props;

    let currentImg = images[currentImgInd];
    let currentImgNumber = currentImgInd + 1 + (page - Math.ceil(images.length / amount)) * amount;


    const viewerImg=(
      <Dialog
        classes={{
          root: classes.dialogRoot,
          paperWidthSm: classes.dialogPaperWidthSm,
        }}
        open={open}
        onClose={this.handleImgClose}
      >
        <img
          className={classes.dialogImg}
          src={currentImg.largeImageURL}
          alt=''
          onLoad={() => { window.clearTimeout(this.state.imgLoadedTimeOutId); this.setState({ imgLoaded: true, imgLoadedTimeOutId: null })}}
        />
      </Dialog>
    )


    const _viewerHeader = (
      <div className={`${classes.toolBar} ${classes.toolBarTop}`}>
        <div className={classes.imgCounter}>
          {currentImgNumber + '/' + formatData(totalHits)}
        </div>
        <IconButton
          className={`${classes.viewerIconButton} ${mobileWithTouch ? null : classes.buttonsHover}`}
          onClick={this.handleImgClose}
          disableRipple
          title='close'
        >
          <Close className={classes.viewerIconStyle} />
        </IconButton>
      </div>
    )


    const viewerAdds = (
      <div className={classes.viewerAdds}>
        <div className={classes.backDrop} onClick={this.handleImgClose} />
        {_viewerHeader}
        <LeftRightButtons
          onChange={(side) => this.handleNextButton({}, side)}
          {...this.props}
        />
        <ImgSocialStat
          currentImg={currentImg}
          currentImgInd={currentImgInd}
          {...this.props}
        />
      </div>
    )


    const currentImgLoading = (
      <div className={`${classes.imgLoadingRoot} ${classes.moreImagesLoadingRoot}`}>
        <CircularProgress
          className={classes.moreImagesLoadingProgress}
          size={50}
        />
      </div>
    )

    
    const moreImagesLoading = (
      <div className={classes.moreImagesLoadingRoot}>
        <CircularProgress
          className={classes.moreImagesLoadingProgress}
          size={50}
        />
      </div>
    );


    return (
      <div>
        {viewerImg}
        {this.state.imgLoaded ? null : currentImgLoading}
        {viewerAdds}
        {nextDataLoading ? moreImagesLoading : null}
      </div>
    )
  }
}

ImgViewer.propTypes = {
  fetchMoreImages: PropTypes.func,
  fetchPage: PropTypes.func,
  fetchViewerOpen: PropTypes.func,
  fetchViewerImg: PropTypes.func,
  fetchWaitNextData: PropTypes.func,
  addToFavorites: PropTypes.func,
  authDialogOpen: PropTypes.func,
  images: PropTypes.array,
  totalHits: PropTypes.number,
  page: PropTypes.number,
  amount: PropTypes.number,
  open: PropTypes.bool,
  currentImgInd: PropTypes.number,
  nextDataLoading: PropTypes.bool.isRequired,
  favorites: PropTypes.array,
  classes: PropTypes.object.isRequired,
  mobileWithTouch: PropTypes.bool
}

const mapStateToProps = state => ({
  images: state.search.images,
  totalHits: state.search.total,
  page: state.search.page,
  open: state.imgViewer.open,
  currentImgInd: state.imgViewer.currentImgInd,
  nextDataLoading: state.imgViewer.nextDataLoading,
  favorites: state.appAdds.favorites,
  mobileWithTouch: state.appAdds.mobileWithTouch,
  amount: state.search.amount,  
})

const mapDispatchToProps = {
  fetchMoreImages,
  fetchPage,
  fetchViewerOpen,
  fetchViewerImg,
  fetchWaitNextData,
  addToFavorites,
  authDialogOpen,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ImgViewer))