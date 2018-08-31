import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import FormControl from '@material-ui/core/FormControl';

import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import Label from '@material-ui/icons/Label';
import LabelOutline from '@material-ui/icons/LabelOutline';

import { fetchImages, fetchColor } from '../../../../../../../actions/searchAction';

import NativeControl from './components/NativeControl';
import CustomControl from './components/CustomControl';
import VerticalXsControl from './components/VerticalXsControl';

import { mainComponentsStyles } from '../Filters.style';

const styles = theme => (mainComponentsStyles(theme));


const options = ['grayscale', 'transparent', 'red', 'orange', 'yellow', 'green',
  'turquoise', 'blue', 'lilac', 'pink', 'white', 'gray', 'black', 'brown'];


const optionsWithColor = new Map([
  ['grayscale', '#708090'],
  ['transparent', 'transparent'],
  ['red', '#f00'],
  ['orange', '#ff8c00'],
  ['yellow', '#ff0'],
  ['green', '#008000'],
  ['turquoise', '40e0d0'],
  ['blue', '#00f'],
  ['lilac', '#c8a2c8'],
  ['pink', '#ff1493'],
  ['white', 'white'],
  ['gray', '#808080'],
  ['black', '#000'],
  ['brown', '#8B4513'],
]);



class ImgColor extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectionRenderer = this.selectionRenderer.bind(this);
    this.calculateOverflow = this.calculateOverflow.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }


  selectionRenderer = (native = false) => {
    const values = this.props.color;

    const headerLabel = value => (
      <Fragment>
        {!native ? `color: ` : null}
        <span className={this.props.classes.selectedValue}>{value}</span>
      </Fragment>
    );
    
    switch (values.length) {
      case 0:
        return '';
      case 1:
        if (values[0] === null) {
          return headerLabel('all');
        }
        return headerLabel(values[0]);
      default:
        return headerLabel(values.join(', '));
    }
  }


  handleChange = (val) => {
    if (val.length === 0) {
      this.props.fetchColor([null]);
    } else {
      switch (true) {
        case ((val[0] === null) && (val[1] !== 'undefined')):
          this.props.fetchColor([val[1]]);
          break;
        case (val[val.length - 1] === null):
          this.props.fetchColor([null]);
          break;
        default:
          this.props.fetchColor(val);
          break;
      }
    }
    this.props.fetchImages();
  }


  handleListItemClick = (val) => {
    const color = [...this.props.color];
    const index = color.indexOf(val);
    if (index === -1) {
      color.push(val);
      this.handleChange(color);
    } else {
      color.splice(index, 1);
      this.handleChange(color);
    }
  }


  calculateOverflow = (native = false, open, collapseRefsObj) => {
    let el = collapseRefsObj.collapsedListRef.current;
    if (open) {
      // get position of elements
      const listStart = el.getBoundingClientRect().top + window.pageYOffset,
        listEnd = listStart + el.getBoundingClientRect().height,
        firstEl = collapseRefsObj.categoryListItem_firstRef.current,
        lastEl = collapseRefsObj.categoryListItem_lastRef.current,
        listItem_first = firstEl.getBoundingClientRect().top + window.pageYOffset + 20,
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
    const { color } = this.props;
    const { classes, ...otherProps } = this.props;

   
    const SetCheckBoxIcon = (x) => {
      if (color && (color.indexOf(x) > -1)) {
        return <CheckBox classes={{ root: classes.MenuItemIconMultipleSelection }} />;
      }
      return <CheckBoxOutlineBlank classes={{ root: classes.MenuItemIconMultipleSelection }} />;
    };


    const SetIconColor = (option) => {
      switch (optionsWithColor.get(option)) {
        case 'transparent':
          return <LabelOutline style={{ color: '#708090' }} />;
        case 'white':
          return <LabelOutline />;
        default:
          return <Label style={{ color: optionsWithColor.get(option) }} />;
      }
    };

    
    const formControlType = () => {
      if (this.props.width === 'xs') {
        // form type for screens with the smallest width resolution ('xs'/portrait)
        return (
          <VerticalXsControl
            options={options}
            onChange={bool => this.props.onChange(bool)}
            handleListItemClick={val => this.handleListItemClick(val)}
            calculateOverflow={(native, open, collapseRefsObj) => this.calculateOverflow(false, open, collapseRefsObj)}
            SetIconColor={option => SetIconColor(option)}
            SetCheckBoxIcon={option => SetCheckBoxIcon(option)}
            selectionRenderer={() => this.selectionRenderer()}
            {...otherProps}
          />
        );
      }
      if (this.props.mobileWithTouch) {
        return (
          <NativeControl
            options={options}
            handleDialogOpen={this.handleDialogOpen}
            handleListItemClick={val => this.handleListItemClick(val)}
            calculateOverflow={(native, open, collapseRefsObj) => this.calculateOverflow(native, open, collapseRefsObj)}
            SetIconColor={option => SetIconColor(option)}
            selectionRenderer={native => this.selectionRenderer(native)}
            {...otherProps}
          />
        );
      }
      return (
        <CustomControl
          options={options}
          SetIconColor={option => SetIconColor(option)}
          SetCheckBoxIcon={option => SetCheckBoxIcon(option)}
          selectionRenderer={() => this.selectionRenderer()}
          handleChange={val => this.handleChange(val)}
          {...otherProps}
        />
      );
    };

    return (
      <FormControl>
        {formControlType()}
      </FormControl>
    );
  }
}

ImgColor.propTypes = {
  fetchImages: PropTypes.func.isRequired,
  fetchColor: PropTypes.func.isRequired,
  color: PropTypes.array.isRequired,
  showFiltersBar: PropTypes.bool,
  mobileWithTouch: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  color: state.search.color,
  mobileWithTouch: state.appAdds.mobileWithTouch,
});

export default connect(mapStateToProps, { fetchImages, fetchColor })(compose(withStyles(styles), withWidth())(ImgColor));
