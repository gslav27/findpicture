import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import { nativeControlFTStyles } from '../../Filters.style';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';


const styles = theme => (nativeControlFTStyles(theme))



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

export default compose(withStyles(styles), withWidth())(NativeControl)