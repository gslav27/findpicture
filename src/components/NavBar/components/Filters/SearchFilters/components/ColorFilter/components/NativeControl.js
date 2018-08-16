import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import { nativeControlClrStyles } from '../../Filters.style';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';

import MoreHoriz from '@material-ui/icons/MoreHoriz';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


const styles = theme => (nativeControlClrStyles(theme))



class NativeControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    }
    this.collapseRefsObj = {
      collapsedListRef: (this.collapsedListRef = React.createRef()),
      categoryListItem_firstRef: (this.categoryListItem_firstRef = React.createRef()),
      categoryListItem_lastRef: (this.categoryListItem_lastRef = React.createRef()),
      nativeControlBoardsWrapRef: (this.nativeControlBoardsWrapRef = React.createRef()),
    }
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.openDialog !== prevState.openDialog) {
      setTimeout(() => this.props.calculateOverflow(true, this.state.openDialog, this.collapseRefsObj), 100);
    }
    if ((this.props.width !== prevProps.width) && (this.props.width === 'xs') && this.state.openDialog) {
      this.setState({ openDialog: false })
    }
  }


  handleDialogOpen = () => {
    this.setState({
      openDialog: !this.state.openDialog
    })
  }


  render() {
    const { options, classes, color, } = this.props;

    const _selectLabel = (
      <InputLabel
        className={classes.nativeControlInputLabel}
        focused={false}
        shrink
      >
        color
      </InputLabel>
    )


    const _select = (
      <div className={classes.rootNativeColorSelect}>
        <button className={classes.nativeColorInputHTML} onClick={this.handleDialogOpen} />
        <div className={classes.nativeColorInput}>
          {this.props.selectionRenderer(true)}
        </div>
        <InputAdornment className={classes.nativeColorInputAdornment}>
          <ArrowDropDownIcon />
        </InputAdornment>
      </div>
    )


    const _selectFieldHeader = (
      <DialogTitle
        className={classes.nativeColorDialogTitle}
        disableTypography
      >
        <span>COLORS</span>
        <ListItem
          button
          value={null}
          onClick={() => this.props.handleListItemClick(null)}
        >
          <ListItemText
            className={`${classes.MenuItemText} filtersMenuItemText`}
            disableTypography={true}
            primary='ALL'
          />
          <Checkbox checked={color.indexOf(null) > -1} />
        </ListItem>
      </DialogTitle>
    )


    const _options = options.map((option, index) => (
      <div key={option} ref={(index === 0) ? this.categoryListItem_firstRef : ((index === (options.length - 1)) ? this.categoryListItem_lastRef : null)}>
        <ListItem
          button
          value={option}
          onClick={() => this.props.handleListItemClick(option)}
        >
          {this.props.SetIconColor(option)}
          <ListItemText
            className={`${classes.MenuItemText} filtersMenuItemText`}
            disableTypography={true}
            primary={option}
          />
          <Checkbox checked={color.indexOf(option) > -1} />
        </ListItem>
      </div>
    ))


    const _selectFieldBody = (
      <DialogContent
        className={classes.nativeColorDialogContent}
        onScroll={() => this.props.calculateOverflow(true, this.state.openDialog, this.collapseRefsObj)}
      >
        <div ref={this.collapsedListRef}>
          <List
            className={classes.nativeColorDialogContentList}
            component="div"
            disablePadding
          >
            {_options}
          </List>
        </div>
      </DialogContent>
    )


    const _overflowIndicator = (
      <div ref={this.nativeControlBoardsWrapRef}>
        <span className={`${classes.overflow} ${classes.overflowTopNative} spanStartNative`}><MoreHoriz /></span>
        <span className={`${classes.overflow} ${classes.overflowBottomNative} spanEndNative`}><MoreHoriz /></span>
      </div>
    )


    return (
      <div className={classes.rootNativeControl}>
        {_selectLabel}
        {_select}
        <Dialog
          classes={{ paperWidthSm: classes.dialogPaperWidthSm, }}
          open={this.state.openDialog}
          onClose={this.handleDialogOpen}
        >
          {_selectFieldHeader}
          <Divider />
          {_selectFieldBody}
          {_overflowIndicator}
        </Dialog>
      </div>
    );
  }
}

export default compose(withStyles(styles), withWidth())(NativeControl)