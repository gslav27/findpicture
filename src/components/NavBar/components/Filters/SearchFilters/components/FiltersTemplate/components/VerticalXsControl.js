import React, { Component } from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MoreHoriz from '@material-ui/icons/MoreHoriz';

import { verticalXsControlStyles } from '../../Filters.style';


const styles = theme => (verticalXsControlStyles(theme));



class VerticalXsControl extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.collapsedListRef = React.createRef();
    this.categoryListItem_firstRef = React.createRef();
    this.categoryListItem_lastRef = React.createRef();
    this.calculateOverflow = this.calculateOverflow.bind(this);
  }


  static getDerivedStateFromProps = (props, state) => {
    if ((props.showFiltersBar !== true) || (props.collapse) !== true) {
      state.open = false;
    }
    return null;
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.open !== prevState.open) {
      this.calculateOverflow();
    }
  }


  collapseFilters = () => {
    this.state.open === false
      ? this.props.onChange(true)
      : this.props.onChange(false);
  }


  handleListHeaderClick = () => {
    this.collapseFilters();
    this.setState({ open: !this.state.open });
  };


  handleListItemClick = (val) => {
    const filterHandler = `fetch${this.props.filter.type[0].toUpperCase()}${this.props.filter.type.slice(1)}`;
    this.props[filterHandler](val);
    this.props.fetchImages();
    this.collapseFilters();
    this.setState({ open: !this.state.open });
  };


  calculateOverflow = () => {
    if (this.props.filter.options.length > 7) {
      const el = this.collapsedListRef.current;
      if (this.state.open) {
        // get position of elements
        const listStart = el.getBoundingClientRect().top + window.pageYOffset,
          listEnd = listStart + el.getBoundingClientRect().height,
          firstEl = this.categoryListItem_firstRef.current,
          lastEl = this.categoryListItem_lastRef.current,
          listItem_first = firstEl.getBoundingClientRect().top + window.pageYOffset + 20,
          listItem_last = lastEl.getBoundingClientRect().top + window.pageYOffset + 20;

        if (listItem_first < listStart) {
          el.classList.add('startOverflow');
        } else {
          el.classList.remove('startOverflow');
        }
        if (listItem_last > listEnd) {
          el.classList.add('endOverflow');
        } else {
          el.classList.remove('endOverflow');
        }
      } else {
        el.classList.remove('startOverflow');
        el.classList.remove('endOverflow');
      }
    }
  };


  render() {
    const {
      filter,
      classes,
      showFiltersBar,
      someItemCollapsed,
    } = this.props;

    const filterValue = this.props[filter.type];

    const { open } = this.state;


    const _collapsedListHeader = (
      <ListItem
        button
        classes={{
          root: classNames(classes.listItemHeader, {
            [classes.listItemHeaderOpen]: open,
            [classes.listItemHeaderHidden]: someItemCollapsed,
          }),
        }}
        onClick={this.handleListHeaderClick}
      >
        <ListItemText
          classes={{ primary: classes.listItemTextHeader }}
          primary={(
            <span>
              {filter.label}: {open ? null : <span className={classes.selectedValue}>{(filterValue == '') ? 'all' : filterValue}</span>}
            </span>
          )}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
    );


    const _optionSelectAll = () => {
      if (filter.allOptions) {
        return (
          <div ref={this.categoryListItem_firstRef}>
            <ListItem
              button
              classes={{ root: classes.listItemNested }}
              onClick={() => this.handleListItemClick('')}
              divider
            >
              {this.props.radioButtonType('')}
              <ListItemText
                inset
                classes={{ primary: classes.listItemTextNested }}
                primary={<span>ALL</span>}
              />
            </ListItem>
          </div>
        );
      }
    };


    const _options = filter.options.map((option, index) => (
      <div key={option} ref={(index === (filter.options.length - 1)) ? this.categoryListItem_lastRef : null}>
        <ListItem
          button
          classes={{ root: classes.listItemNested }}
          onClick={() => this.handleListItemClick(option)}
        >
          {this.props.radioButtonType(option)}
          <ListItemText
            inset
            classes={{ primary: classes.listItemTextNested }}
            primary={<span>{option}</span>}
          />
        </ListItem>
      </div>
    ));


    return (
      <List className={classes.rootListWrap}>
        {_collapsedListHeader}
        <Collapse
          in={(showFiltersBar && open)}
          timeout='auto'
          unmountOnExit
          onEntered={(node) => { node.style.transition = '0s'; }} // Fix flicker in Safari 9 when collapse finishes entering
        >
          <div ref={this.collapsedListRef}>
            <List
              className={classes.listCollapsedItems}
              component='div'
              disablePadding
              onScroll={this.calculateOverflow}
            >
              {_optionSelectAll()}
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

export default compose(withStyles(styles), withWidth())(VerticalXsControl);
