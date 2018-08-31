import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { customControlStyles } from '../../Filters.style';


const styles = theme => (customControlStyles(theme));



const CustomControl = (props) => {
  const {
    filter,
    classes,
    filterHandler,
  } = props;

  const filterValue = props[filter.type];


  const _optionsHeader = (
    <MenuItem
      classes={{ root: classes.MenuItemDisabled }}
      disabled
      divider
      dense
    >
      <span className={classes.MenuItemDisabledText}>{filter.label}: </span><em className={classes.MenuItemDisabledHook}>{filterValue}</em>
    </MenuItem>
  );


  const _optionSelectAll = () => {
    if (filter.allOptions) {
      return (
        <MenuItem
          value=''
          dense
          divider
        >
          {props.radioButtonType('')}
          <span className={classes.MenuItemText}>ALL</span>
        </MenuItem>
      );
    }
  };


  const _options = filter.options.map(option => (
    <MenuItem
      key={option}
      value={option}
      dense
    >
      {props.radioButtonType(option)}
      <span className={`${classes.MenuItemText} filtersMenuItemText`}> {option} </span>
    </MenuItem>
  ));


  return (
    <Select
      name={filter.type}
      className={classes.rootSelectWrap}
      classes={{
        root: classes.rootSelect,
        select: classes.select,
      }}
      autoWidth
      value={filterValue}
      renderValue={() => <span>{filter.label}: <span className={classes.selectedValue}>{(filterValue == '') ? 'all' : filterValue}</span> </span>}
      onChange={(e) => { props[filterHandler](e.target.value); props.fetchImages(); }}
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
          classes: { padding: classes.MenuPropsListPadding },
        },
        BackdropProps: {
          invisible: false,
          className: classes.backDropRoot,
        },
      }}
    >
      {_optionsHeader}
      {_optionSelectAll()}
      {_options}
    </Select>
  );
};

export default compose(withStyles(styles), withWidth())(CustomControl);
