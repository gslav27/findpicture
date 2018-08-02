import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { 
  fetchImages, 
  fetchOrder,
  fetchCategory,
  fetchImageType,
  fetchOrientation,
} from '../../../actions/searchAction';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import { filtersStylesPattern } from './FiltersStyles';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InputLabel from '@material-ui/core/InputLabel';

import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MoreHoriz from '@material-ui/icons/MoreHoriz';


const styles = theme => (filtersStylesPattern(theme))



class NativeControl extends Component {
  render() {
    const {
      filter,
      classes,
      filterHandler,
    } = this.props;


    // set width of NativeControl selected value container
    let nativeControlWidth;
    switch (true) {
      case (this.props[filter.type] === ''):
        nativeControlWidth = '3em'
        break;
      case (this.props[filter.type].length === 4):
        nativeControlWidth = '4em'
        break;
      default:
        nativeControlWidth = `${(this.props[filter.type].length - 4) * 0.5 + 4.2}em`
        break;
    }

    
    const _optionsHeader = (
      <option disabled>
        {filter.label}:
      </option>
    )


    const _optionSelectAll = () => {
      if (filter.allOptions) {
        return (
          <option className={classes.nativeControlOption} value={''}>
            all
          </option>
        )
      }
    }


    const _options = filter.options.map(option => (
      <option key={option} className={classes.nativeControlOption} value={option}>
        {option}
      </option>
    ))
    

    return (
      <div className={`${classes.rootNativeControl}`} style={{ width: nativeControlWidth }}>
        <InputLabel
          className={classes.nativeControlInputLabel}
          focused={false}
          shrink
        >
          {filter.label}
        </InputLabel>
        <Select
          native
          name={filter.type}
          className={`${classes.rootSelectWrap} ${classes.selectedValue}`}
          classes={{
            root: classes.rootSelect,
            select: classes.select,
          }}
          autoWidth={true}
          value={this.props[filter.type]}
          onChange={(e) => { this.props[filterHandler](e.target.value); this.props.fetchImages() }}
          disableUnderline={true}
        >
          {_optionsHeader}
          {_optionSelectAll()}
          {_options}
        </Select>
      </div>
    );
  }
}



class CustomControl extends Component {
  render() {
    const {
      filter,
      classes,
      filterHandler,
    } = this.props;


    const _optionsHeader = (
      <MenuItem
        classes={{ root: classes.MenuItemDisabled }}
        disabled
        divider
        dense={true}
      >
        <span className={classes.MenuItemDisabledText}>{filter.label}: </span><em className={classes.MenuItemDisabledHook}>{this.props[filter.type]}</em>
      </MenuItem>
    )


    const _optionSelectAll = () => {
      if (filter.allOptions) {
        return (
          <MenuItem
            value=''
            dense
            divider
          >
            {this.props.radioButtonType('')}
            <span className={classes.MenuItemText}>ALL</span>
          </MenuItem>
        )
      }
    }


    const _options = filter.options.map(option => (
      <MenuItem
        key={option}
        value={option}
        dense={true}
      >
        {this.props.radioButtonType(option)}
        <span className={`${classes.MenuItemText} filtersMenuItemText`}> {option} </span>
      </MenuItem>
    ))


    return (
      <Select
        name={filter.type}
        className={classes.rootSelectWrap}
        classes={{
          root: classes.rootSelect,
          select: classes.select,
        }}
        autoWidth={true}
        value={this.props[filter.type]}
        renderValue={() => <span>{filter.label}: <span className={classes.selectedValue}>{(this.props[filter.type] == '') ? 'all' : this.props[filter.type]}</span> </span>}
        onChange={(e) => { this.props[filterHandler](e.target.value); this.props.fetchImages() }}
        disableUnderline
        displayEmpty
        MenuProps={{
          className: classes.selectedMenuPaper,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          // for anchorOrigin:
          getContentAnchorEl: null,
          MenuListProps: {
            className: 'SelectedMenuList',
            classes: {
              padding: classes.MenuPropsListPadding
            }
          },
          BackdropProps: {
            invisible: false,
            className: classes.backDropRoot
          },
        }}
      >
        {_optionsHeader}
        {_optionSelectAll()}
        {_options}
      </Select>
    );
  }
}



class VerticalXsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
    this.collapsedListRef = React.createRef();
    this.categoryListItem_firstRef = React.createRef();
    this.categoryListItem_lastRef = React.createRef();
    this.calculateOverflow = this.calculateOverflow.bind(this);
  }


  static getDerivedStateFromProps = (props, state) => {
    if ((props.showFiltersBar !== true) || (props.collapse) !== true) {
      state.open = false
    }
    return null
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.open !== prevState.open) {
      this.calculateOverflow()
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


  handleListItemClick = (val) => {
    let filterHandler = 'fetch' + this.props.filter.type[0].toUpperCase() + this.props.filter.type.slice(1);
    this.props[filterHandler](val);
    this.props.fetchImages();
    this.collapseFilters();
    this.setState({ open: !this.state.open });
  };


  calculateOverflow = () => {
    if (this.props.filter.options.length > 7) {
      let el = this.collapsedListRef.current;
      if (this.state.open) {
        let listStart, listEnd, listItem_first, listItem_last;
        // get position of elements
        listStart = el.getBoundingClientRect().top + window.pageYOffset;
        listEnd = listStart + el.getBoundingClientRect().height;
        let firstEl = this.categoryListItem_firstRef.current;
        let lastEl = this.categoryListItem_lastRef.current;
        listItem_first = firstEl.getBoundingClientRect().top + window.pageYOffset + 20;
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


    // Fix flicker in Safari 9 when collapse finishes entering
    const removeTransition = node => {
      node.style.transition = '0s';
      requestAnimationFrame(() => {
        node.style.transitiіon = '';
      });
    };


    const _collapsedListHeader = (
      <ListItem
        button
        classes={{
          root: `${classes.listItemHeader} ${this.state.open ? classes.listItemHeaderOpen : null} ${someItemCollapsed ? classes.listItemHeaderHidden : null}`,
        }}
        onClick={this.handleListHeaderClick}
      >
        <ListItemText
          classes={{ primary: classes.listItemTextHeader }}
          primary={
            <span>
              {filter.label}: {this.state.open ? null : <span className={classes.selectedValue}>{(this.props[filter.type] == '') ? 'all' : this.props[filter.type]}</span>}
            </span>
          }
        />
        {this.state.open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
    )


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
        )
      }
    }


    const _options = filter.options.map((option, index) => (
      <div key={option} ref={(index === (filter.options.length - 1)) ? this.categoryListItem_lastRef : null}>
        <ListItem
          button
          classes={{  root: classes.listItemNested }}
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
    ))


    return (
      <List className={classes.rootListWrap}>
        {_collapsedListHeader}
        <Collapse
          in={(showFiltersBar && this.state.open)}
          timeout="auto"
          unmountOnExit
          onEntered={removeTransition}
        >
          <div ref={this.collapsedListRef}>
            <List
              className={classes.listCollapsedItems}
              component="div"
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



class FiltersTemplate extends Component {
  render() {
    const { 
      filter, 
      classes, 
      mobileWithTouch, 
      width,
    } = this.props;
    
    let filterHandler = 'fetch' + filter.type[0].toUpperCase() + filter.type.slice(1);


    const SetRadioButtonIcon = (x) => {
      if (this.props[filter.type] === x) {
        return <RadioButtonChecked className={classes.MenuItemIcon} />
      } else {
        return <RadioButtonUnchecked className={classes.MenuItemIcon} />
      }
    }

    const formControlType = () => {
      if (width === 'xs') {
        // form type for screens with the smallest width resolution ('xs'/portrait)
        return (
          <VerticalXsControl
            filterHandler={filterHandler}
            radioButtonType={SetRadioButtonIcon}
            onChange={(bool) => this.props.onChange(bool)}
            {...this.props}
          />
        )
      } else if (mobileWithTouch) {
        return (
          <NativeControl
            filterHandler={filterHandler}
            {...this.props}
          />
        )
      } else {
        return (
          <CustomControl
            filterHandler={filterHandler}
            radioButtonType={SetRadioButtonIcon}
            {...this.props}
          />
        )
      }
    }
    
    return (
      <FormControl>
        {formControlType()}
      </FormControl>
    )
  }
} 
  
FiltersTemplate.propTypes = {
  fetchImages: PropTypes.func.isRequired,
  fetchOrder: PropTypes.func.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  fetchImageType: PropTypes.func.isRequired,
  fetchOrientation: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  imageType: PropTypes.string.isRequired,
  orientation: PropTypes.string.isRequired,
  showFiltersBar: PropTypes.bool,
  mobileWithTouch: PropTypes.bool.isRequired,
  collapse: PropTypes.bool,
}

const mapStateToProps = state => ({
  order: state.search.order,
  category: state.search.category,
  imageType: state.search.imageType,
  orientation: state.search.orientation,
  mobileWithTouch: state.appAdds.mobileWithTouch,
})

const mapDispatchToProps = {
  fetchImages,
  fetchOrder,
  fetchCategory,
  fetchImageType,
  fetchOrientation,
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles), withWidth(), )(FiltersTemplate))