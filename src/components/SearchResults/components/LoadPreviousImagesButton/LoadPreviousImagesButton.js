import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchMoreImages } from '../../../../actions/searchAction';

import { withStyles } from '@material-ui/core/styles';
import loadPreviousImagesButton from './LoadPreviousImagesButton.style';

import IconButton from '@material-ui/core/IconButton';

import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Close from '@material-ui/icons/Close';


const styles = loadPreviousImagesButton

class LoadPreviousImagesButton extends Component {
  addHiddenClass = () => {
    let {windowTop, match} = this.props;
    if ( windowTop && match.params.page != 1 && match.params.page != undefined ) {
      return false
    }
    return true
  }


  render() {
    const {
      classes,
      width,
      mobileWithTouch,
      match,
    } = this.props;


    const _loadButton = (
      <IconButton
        classes={{ root: classes.loadPreviousImagesButton, }}
        onClick={() => { this.props.fetchMoreImages(false, false, (match.params.page - 1)) }}
        title='load previous images'
      >
        <ArrowUpward />
        <span> load previous images </span>
        {(width !== 'xs') ? <ArrowUpward /> : null}
      </IconButton>
    )


    const _closeButton = (
      <IconButton
        className={`${classes.loadPreviousImagesCloseButton} ${mobileWithTouch ? classes.loadPreviousImagesCloseButtonMobile : null}`}
        onClick={() => this.props.onCloseButtonClick()}
        disableRipple
        title='close'
        size='large'
      >
        <Close />
      </IconButton>
    )

    
    return (
      <div className={`${classes.loadPreviousImagesRoot} ${this.addHiddenClass() ? 'hidden' : null}`}>
        {_loadButton}
        {_closeButton}
      </div>
    )
  }
}


LoadPreviousImagesButton.propTypes = {
  onCloseButtonClick: PropTypes.func.isRequired,
  fetchMoreImages: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  mobileWithTouch: PropTypes.bool,
  windowTop: PropTypes.bool,
}

const mapStateToProps = state => ({
  mobileWithTouch: state.appAdds.mobileWithTouch,
  windowTop: state.appAdds.windowTop
});


export default connect(mapStateToProps, { fetchMoreImages })(withStyles(styles)(LoadPreviousImagesButton))