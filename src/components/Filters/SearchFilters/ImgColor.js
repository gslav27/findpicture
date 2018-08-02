import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchImages, fetchColor } from '../../../actions/searchAction';

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
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';

import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Label from '@material-ui/icons/Label';
import LabelOutline from '@material-ui/icons/LabelOutline';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


const styles = theme => (filtersStylesPattern(theme))



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
    const { options, classes, color,} = this.props;

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



class CustomControl extends Component {
  render() {
    const { options, classes, color, } = this.props;


    const _optionsHeader = (
      <MenuItem
        classes={{ root: classes.MenuItemDisabled,}}
        disabled
        divider
        dense
      >
        <span className={classes.MenuItemDisabledText}>color: </span><em className={classes.MenuItemDisabledHook}>{color}</em>
      </MenuItem>
    )


    const _optionSelectAll = (
      <MenuItem
        value={null}
        dense
        divider
      >
        <span className={classes.MenuItemText}>ALL</span>
        {this.props.SetCheckBoxIcon(null)}
      </MenuItem>
    )


    const _options = options.map(option => (
      <MenuItem
        key={option}
        value={option}
        dense
      >
        {this.props.SetIconColor(option)}
        <span className={`${classes.MenuItemText} filtersMenuItemText`}> {option} </span>
        {this.props.SetCheckBoxIcon(option)}
      </MenuItem>
    ))


    return (
      <Select
        name='color'
        className={classes.rootSelectWrap}
        classes={{
          root: classes.rootSelect,
          select: classes.select,
        }}
        multiple
        autoWidth
        value={color}
        renderValue={() => this.props.selectionRenderer()}
        onChange={(e) => this.props.handleChange(e.target.value)}
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
        {_optionSelectAll}
        {_options}
      </Select>
    );
  }
}



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
            this.state.open ? <span>color: </span> : this.props.selectionRenderer()
          }
        />
        {this.state.open ? <ExpandLess /> : <ExpandMore />}
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
          in={(showFiltersBar && this.state.open)}
          timeout="auto"
          unmountOnExit
          onEntered={removeTransition}
        >
          <div ref={this.collapsedListRef}>
            <List
              component="div"
              className={classes.listCollapsedItems}
              disablePadding
              onScroll={() => this.props.calculateOverflow(false, this.state.open, this.collapseRefsObj)}
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



class ImgColor extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectionRenderer = this.selectionRenderer.bind(this);
    this.calculateOverflow = this.calculateOverflow.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }


  selectionRenderer = (native=false) => {
    let values = this.props.color;
    let { classes } = this.props;
    if (!native) {
      switch (values.length) {
        case 0:
          return '';
        case 1:
          if (values[0] === null) {
            return (<span>color: <span className={classes.selectedValue}>all</span></span>)
          }
          return (<span>color: <span className={classes.selectedValue}>{values[0]}</span></span>);
        default:
          return (<span>color: <span className={classes.selectedValue}>{values.join(', ')}</span></span>);
      }
    } else {
      switch (values.length) {
        case 0:
          return '';
        case 1:
          if (values[0] === null) {
            return (<span className={classes.selectedValue}>all</span>)
          }
          return (<span className={classes.selectedValue}>{values[0]}</span>);
        default:
          return (<span className={classes.selectedValue}>{values.join(', ')}</span>);
      }
    }
  }


  handleChange = (val) => {
    if (val.length === 0) {
      this.props.fetchColor([null])
    } else {  
      switch (true) {
        case ((val[0] === null) && (val[1] !== 'undefined')):
          this.props.fetchColor([val[1]])
          break;
        case (val[val.length - 1] === null):
          this.props.fetchColor([null])
          break;
        default:
          this.props.fetchColor(val)
      }
    }
    this.props.fetchImages()
  }


  handleListItemClick = (val) => {
    let color = [...this.props.color]; 
    let index = color.indexOf(val);
    if (index === -1) {
      color.push(val);
      this.handleChange(color) 
    } else {
      color.splice(index, 1);
      this.handleChange(color);
    }
  }


  calculateOverflow = (native = false, open, collapseRefsObj) => {
    let el = collapseRefsObj.collapsedListRef.current;
    if (open) {
      let listStart, listEnd, listItem_first, listItem_last;
      // get position of elements
      listStart = el.getBoundingClientRect().top + window.pageYOffset;
      listEnd = listStart + el.getBoundingClientRect().height;
      let firstEl = collapseRefsObj.categoryListItem_firstRef.current;
      let lastEl = collapseRefsObj.categoryListItem_lastRef.current;
      listItem_first = firstEl.getBoundingClientRect().top + window.pageYOffset + 20;
      listItem_last = lastEl.getBoundingClientRect().top + window.pageYOffset + 20;

      native ? (el = collapseRefsObj.nativeControlBoardsWrapRef.current) : null;

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
  };


  render() {
    const { classes,  color, mobileWithTouch, width} = this.props;

    const options = ["grayscale", "transparent", "red", "orange", "yellow", "green",
    "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

    const optionsWithColor = new Map([
      ["grayscale", '#708090'], 
      ["transparent", 'transparent'],
      ["red", '#f00'],
      ["orange", '#ff8c00'],
      ["yellow", '#ff0'],
      ["green", '#008000'],
      ["turquoise", '40e0d0'],
      ["blue", '#00f'],
      ["lilac", '#c8a2c8'],
      ["pink", '#ff1493'],
      ["white", 'white'],
      ["gray", '#808080'],
      ["black", '#000'],
      ["brown", '#8B4513'],
    ])

   
    const SetCheckBoxIcon = (x) => {
      if (color && (color.indexOf(x) > -1)) {
        return <CheckBox classes={{ root: classes.MenuItemIconMultipleSelection }} />
      } else {
        return <CheckBoxOutlineBlank classes={{ root: classes.MenuItemIconMultipleSelection }} />
      }
    }


    const SetIconColor = (option) => {
      switch (true) {
        case (optionsWithColor.get(option) === 'transparent'):
          return <LabelOutline style={{ color: '#708090',}}/>
        case (optionsWithColor.get(option) === 'white'):
          return <LabelOutline />
        default:
          return <Label style={{ color: optionsWithColor.get(option), }} />
      }
    }

    
    const formControlType = () => {
      if (width === 'xs') {
        // form type for screens with the smallest width resolution ('xs'/portrait)
        return (
          <VerticalXsControl
            options={options}
            onChange={(bool) => this.props.onChange(bool)}
            handleListItemClick={(val) => this.handleListItemClick(val)}
            calculateOverflow={(native, open, collapseRefsObj) => this.calculateOverflow(false, open, collapseRefsObj)}
            SetIconColor={(option) => SetIconColor(option)}
            SetCheckBoxIcon={(option) => SetCheckBoxIcon(option)}
            selectionRenderer={() => this.selectionRenderer()}
            {...this.props}
          />
        )
      } else if (mobileWithTouch) {
        return (
          <NativeControl
            options={options}
            handleDialogOpen={this.handleDialogOpen}
            handleListItemClick={(val) => this.handleListItemClick(val)}
            calculateOverflow={(native, open, collapseRefsObj) => this.calculateOverflow(native, open, collapseRefsObj)}
            SetIconColor={(option) => SetIconColor(option)}
            selectionRenderer={(native) => this.selectionRenderer(native)}
            {...this.props}
          />
        )
      } else {
        return (
          <CustomControl
            options={options}
            SetIconColor={(option) => SetIconColor(option)}
            SetCheckBoxIcon={(option) => SetCheckBoxIcon(option)}
            selectionRenderer={() => this.selectionRenderer()}
            handleChange={(val) => this.handleChange(val)}
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

ImgColor.propTypes = {
  fetchImages: PropTypes.func.isRequired,
  fetchColor: PropTypes.func.isRequired,
  color: PropTypes.array.isRequired,
  showFiltersBar: PropTypes.bool,
  mobileWithTouch: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  color: state.search.color,
  mobileWithTouch: state.appAdds.mobileWithTouch,
})

export default connect(mapStateToProps, { fetchImages, fetchColor })(compose(withStyles(styles), withWidth(), )(ImgColor))