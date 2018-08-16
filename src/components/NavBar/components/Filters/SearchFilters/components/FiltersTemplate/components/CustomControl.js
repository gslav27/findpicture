import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import { customControlStyles } from '../../Filters.style';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


const styles = theme => (customControlStyles(theme))



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

export default compose(withStyles(styles), withWidth())(CustomControl)