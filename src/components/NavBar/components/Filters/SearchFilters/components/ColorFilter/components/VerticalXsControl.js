import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import { verticalXsControlStyles } from '../../Filters.style';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MoreHoriz from '@material-ui/icons/MoreHoriz';


const styles = theme => (verticalXsControlStyles(theme))



class VerticalXsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
    this.collapseRefsObj = {
      collapsedListRef: (this.collapsedListRef = React.createRef()),
      categoryListItem_firstRef: (this.categoryListItem_firstRef = React.createRef()),
      categoryListItem_lastRef: (this.categoryListItem_lastRef = React.createRef()),
    }
  }


  static getDerivedStateFromProps = (props, state) => {
    if ((props.showFiltersBar !== true) || (props.collapse) !== true) {
      state.open = false
    }
    return null
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.open !== prevState.open) {
      this.props.calculateOverflow(false, this.state.open, this.collapseRefsObj)
    }
  }


  collapseFilters = () => {
    this.state.open === false
      ? this.props.onChange(true)
      : this.props.onChange(false)
  }


  handleListHeaderClick = () => {
    this.collapseFilters();
    this.setState({ open: !this.state.open });
  };


  render() {
    const { options, classes, showFiltersBar, someItemCollapsed } = this.props;
    const { open } = this.state;


    const _collapsedListHeader = (
      <ListItem
        button
        classes={{
          root: `${classes.listItemHeader} ${open ? classes.listItemHeaderOpen : null} ${someItemCollapsed ? classes.listItemHeaderHidden : null}`,
        }}
        onClick={this.handleListHeaderClick}
      >
        <ListItemText
          classes={{ primary: classes.listItemTextHeader }}
          primary={
            open ? <span>color: </span> : this.props.selectionRenderer()
          }
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
    )


    const _optionSelectAll = (
      <div ref={this.categoryListItem_firstRef}>
        <ListItem
          button
          classes={{
            root: classes.listItemNested,
          }}
          onClick={() => this.props.handleListItemClick(null)}
          divider
        >
          <ListItemText
            classes={{ primary: classes.listItemTextNested }}
            primary={<span>ALL</span>}
          />
          {this.props.SetCheckBoxIcon(null)}
        </ListItem>
      </div>
    )


    const _options = (
      options.map((option, index) => (
        <div key={option} ref={(index === (options.length - 1)) ? this.categoryListItem_lastRef : null}>
          <ListItem
            button
            classes={{
              root: classes.listItemNested,
            }}
            onClick={() => this.props.handleListItemClick(option)}
          >
            {this.props.SetIconColor(option)}
            <ListItemText
              inset
              classes={{ primary: classes.listItemTextNested }}
              primary={<span>{option}</span>}
            />
            {this.props.SetCheckBoxIcon(option)}
          </ListItem>
        </div>
      ))
    )


    return (
      <List className={classes.rootListWrap}>
        {_collapsedListHeader}
        <Collapse
          in={(showFiltersBar && open)}
          timeout="auto"
          unmountOnExit
          onEntered={node => {node.style.transition = '0s'}} // Fix flicker in Safari 9 when collapse finishes entering
        >
          <div ref={this.collapsedListRef}>
            <List
              component="div"
              className={classes.listCollapsedItems}
              disablePadding
              onScroll={() => this.props.calculateOverflow(false, open, this.collapseRefsObj)}
            >
              {_optionSelectAll}
              {_options}
            </List>
            <span className={`${classes.overflow} ${classes.overflowTop} spanStart`}><MoreHoriz /></span>
            <span className={`${classes.overflow} ${classes.overflowBottom} spanEnd`}><MoreHoriz /></span>
          </div>
        </Collapse>
      </List>
    );
  }
}

export default compose(withStyles(styles), withWidth())(VerticalXsControl)