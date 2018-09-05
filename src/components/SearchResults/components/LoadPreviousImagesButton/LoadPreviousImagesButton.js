import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Close from '@material-ui/icons/Close';

import { fetchMoreImages } from '../../../../operations/searchOperations';

import loadPreviousImagesButton from './LoadPreviousImagesButton.style';


const styles = loadPreviousImagesButton;

class LoadPreviousImagesButton extends Component {
  addHiddenClass = () => {
    const { windowTop, match } = this.props;
    if (windowTop && Number(match.params.page) > 1) {
      return false;
    }
    return true;
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
        classes={{ root: classes.loadPreviousImagesButton }}
        onClick={() => { this.props.fetchMoreImages(false, false, (match.params.page - 1)); }}
        title='load previous images'
      >
        <ArrowUpward />
        <span> load previous images </span>
        {(width !== 'xs') ? <ArrowUpward /> : null}
      </IconButton>
    );


    const _closeButton = (
      <IconButton
        className={classNames(classes.loadPreviousImagesCloseButton, { [classes.loadPreviousImagesCloseButtonMobile]: mobileWithTouch })}
        onClick={() => this.props.onCloseButtonClick()}
        disableRipple
        title='close'
        size='large'
      >
        <Close />
      </IconButton>
    );

    
    return (
      <div className={classNames(classes.loadPreviousImagesRoot, { hidden: this.addHiddenClass() })}>
        {_loadButton}
        {_closeButton}
      </div>
    );
  }
}


LoadPreviousImagesButton.propTypes = {
  onCloseButtonClick: PropTypes.func.isRequired,
  fetchMoreImages: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  mobileWithTouch: PropTypes.bool,
  windowTop: PropTypes.bool,
};

const mapStateToProps = state => ({
  mobileWithTouch: state.appAdds.mobileWithTouch,
  windowTop: state.appAdds.windowTop,
});


export default connect(mapStateToProps, { fetchMoreImages })(withStyles(styles)(LoadPreviousImagesButton));
