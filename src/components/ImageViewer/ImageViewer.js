import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchMoreImages, fetchPage, } from '../../actions/searchAction';
import { fetchViewerImg, fetchViewerOpen, fetchWaitNextData, } from '../../actions/imgViewerAction';
import { formatData, } from '../../actions/appAddsAction';

import { withStyles } from '@material-ui/core/styles';
import imageViewerStyles from './ImageViewer.styles';

import ImgSocialStat from '../UI/ImgSocialStat';
import LeftRightButtons from './components/LeftRightButtons/LeftRightButtons';

import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import Close from '@material-ui/icons/Close';


const styles = imageViewerStyles();


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


  onImgLoad = () => {
    window.clearTimeout(this.state.imgLoadedTimeOutId);
    this.setState({
      imgLoaded: true,
      imgLoadedTimeOutId: null
    })
  }


  calculateCurrentImgNumber = () => {
    let {
      currentImgInd,
      page,
      images,
      amount
    } = this.props;
    return (currentImgInd + 1 + (page - Math.ceil(images.length / amount)) * amount)
  }

  
  render() { 
    const { 
      classes,
      mobileWithTouch,
      nextDataLoading,
      currentImgInd,
      totalHits,
      images,
      open,
      ...otherProps,
    } = this.props;

    let currentImg = images[currentImgInd];


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
          onLoad={() => this.onImgLoad()}
        />
      </Dialog>
    )


    const _viewerHeader = (
      <div className={`${classes.toolBar} ${classes.toolBarTop}`}>
        <div className={classes.imgCounter}>
          {this.calculateCurrentImgNumber() + '/' + formatData(totalHits)}
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
          mobileWithTouch={mobileWithTouch}
          {...otherProps}
        />
        <div className={`${classes.toolBar} ${classes.toolBarBottom}`}>
          <ImgSocialStat
            img={currentImg}
            imgIndex={currentImgInd}
            componentType='imageviewer'
          />
        </div>
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
  images: PropTypes.array,
  totalHits: PropTypes.number,
  page: PropTypes.number,
  amount: PropTypes.number,
  open: PropTypes.bool,
  currentImgInd: PropTypes.number,
  nextDataLoading: PropTypes.bool.isRequired,
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
  mobileWithTouch: state.appAdds.mobileWithTouch,
  amount: state.search.amount,  
})

const mapDispatchToProps = {
  fetchMoreImages,
  fetchPage,
  fetchViewerOpen,
  fetchViewerImg,
  fetchWaitNextData,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ImgViewer))