import React from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

import leftRightButtonsStyles from './LeftRightButtons.styles';


const styles = leftRightButtonsStyles;


const LeftRightButtons = (props) => {
  const {
    mobileWithTouch,
    classes,
  } = props;

  return (
    <div className={classes.viewerAddsNavigation}>
      <IconButton
        onClick={() => props.onChange('left')}
        classes={{
          root: classNames(classes.viewerIconButtonLR, { [classes.buttonsHover]: !mobileWithTouch }),
          label: classes.viewerIconButtonLabel,
        }}
        disableRipple
        title='left'
      >
        <ChevronLeft className={classes.viewerIconStyleLR} />
      </IconButton>
      <IconButton
        onClick={() => props.onChange('right')}
        className={classes.viewerIconButtonLabelRight}
        classes={{
          root: classNames(classes.viewerIconButtonLR, { [classes.buttonsHover]: !mobileWithTouch }),
          label: classes.viewerIconButtonLabel,
        }}
        disableRipple
        title='right'
      >
        <ChevronRight className={classes.viewerIconStyleLR} />
      </IconButton>
    </div>
  );
};

export default withStyles(styles)(LeftRightButtons);
