import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { 
  fetchImages, 
  fetchOrder,
  fetchCategory,
  fetchImageType,
  fetchOrientation,
} from '../../../../../../../actions/searchAction';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import { mainComponentsStyles } from '../Filters.style';

import NativeControl from './components/NativeControl';
import CustomControl from './components/CustomControl';
import VerticalXsControl from './components/VerticalXsControl';

import FormControl from '@material-ui/core/FormControl';

import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';


const styles = theme => (mainComponentsStyles(theme))



class FiltersTemplate extends Component {
  render() {
    const { 
      classes, 
      ...otherProps
    } = this.props;

    const filterType = this.props.filter.type;
    
    let filterHandler = 'fetch' + filterType[0].toUpperCase() + filterType.slice(1);


    const SetRadioButtonIcon = (x) => {
      if (this.props[filterType] === x) {
        return <RadioButtonChecked className={classes.MenuItemIcon} />
      } else {
        return <RadioButtonUnchecked className={classes.MenuItemIcon} />
      }
    }

    const formControlType = () => {
      if (this.props.width === 'xs') {
        // form type for screens with the smallest width resolution ('xs'/portrait)
        return (
          <VerticalXsControl
            filterHandler={filterHandler}
            radioButtonType={SetRadioButtonIcon}
            onChange={(bool) => this.props.onChange(bool)}
            {...otherProps}
          />
        )
      } else if (this.props.mobileWithTouch) {
        return (
          <NativeControl
            filterHandler={filterHandler}
            {...otherProps}
          />
        )
      } else {
        return (
          <CustomControl
            filterHandler={filterHandler}
            radioButtonType={SetRadioButtonIcon}
            {...otherProps}
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