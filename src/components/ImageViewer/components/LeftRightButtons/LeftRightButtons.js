import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import leftRightButtonsStyles from './LeftRightButtons.styles';

import IconButton from '@material-ui/core/IconButton';

import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';


const styles = leftRightButtonsStyles;


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

export default withStyles(styles)(LeftRightButtons)