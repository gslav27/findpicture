import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { customControlStyles } from '../../Filters.style';

const styles = theme => (customControlStyles(theme));



const CustomControl = (props) => {
  const { options, classes, color } = props;


  const _optionsHeader = (
    <MenuItem
      classes={{ root: classes.MenuItemDisabled }}
      disabled
      divider
      dense
    >
      <span className={classes.MenuItemDisabledText}>color: </span><em className={classes.MenuItemDisabledHook}>{color}</em>
    </MenuItem>
  );


  const _optionSelectAll = (
    <MenuItem
      value={null}
      dense
      divider
    >
      <span className={classes.MenuItemText}>ALL</span>
      {props.SetCheckBoxIcon(null)}
    </MenuItem>
  );


  const _options = options.map(option => (
    <MenuItem
      key={option}
      value={option}
      dense
    >
      {props.SetIconColor(option)}
      <span className={`${classes.MenuItemText} filtersMenuItemText`}> {option} </span>
      {props.SetCheckBoxIcon(option)}
    </MenuItem>
  ));


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
      renderValue={() => props.selectionRenderer()}
      onChange={e => props.handleChange(e.target.value)}
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
      {_optionSelectAll}
      {_options}
    </Select>
  );
};

export default compose(withStyles(styles), withWidth())(CustomControl);
