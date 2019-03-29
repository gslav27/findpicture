import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';

import Divider from '@material-ui/core/Divider';

import FiltersTemplate from './components/FiltersTemplate/FiltersTemplate';
import ImgColor from './components/ColorFilter/ColorFilter';
import Backdrop from '../../../../UI/Backdrop';

import searchFiltersStyle from './SearchFilters.style';


const styles = theme => (searchFiltersStyle(theme));
  

const filtersProps = {
  order: {
    type: 'order',
    options: ['popular', 'latest'],
    label: 'order by',
    allOptions: false,
  },
  orientation: {
    type: 'orientation',
    options: ['horizontal', 'vertical'],
    label: 'orientation',
    allOptions: true,
  },
  type: {
    type: 'imageType',
    options: ['photo', 'illustration', 'vector'],
    label: 'type',
    allOptions: true,
  },
  category: {
    type: 'category',
    options: ['fashion', 'nature', 'backgrounds', 'science', 'education', 'people', 'feelings', 'religion', 'health', 'places', 'animals', 'industry', 'food', 'computer', 'sports', 'transportation', 'travel', 'buildings', 'business', 'music'],
    label: 'category',
    allOptions: true,
  },
};


class SearchFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        order: false,
        orientation: false,
        category: false,
        color: false,
        type: false,
      },
      someItemCollapsed: false,
    };
  }


  static getDerivedStateFromProps = (props, state) => {
    (props.showFiltersBar !== true) ? (state.someItemCollapsed = false) : null;
    return null;
  }


  componentWillUnmount = () => {
    (this.props.width === 'xs') ? this.props.onChange() : null;
  }
  

  handleItemCollapse = (filter, bool) => {
    // create new copy of this.state.collapse with all 'filters' set to 'false'
    const newState = {};
    Object.keys(this.state.collapse).forEach(key => newState[key] = false);
    // set current collapse value of handled filter
    newState[filter] = bool;
    // update this.state.collapse
    this.setState({
      collapse: newState,
      someItemCollapsed: bool,
    });
  }


  render() {
    const { classes, showFiltersBar, mobileWithTouch, width } = this.props;

    
    const filtersComponents = Object.keys(filtersProps).map((filterType) => {
      const filterObj = filtersProps[filterType];
      return (
        <FiltersTemplate
          key={filterObj.type}
          filter={filterObj}
          showFiltersBar={showFiltersBar}
          someItemCollapsed={this.state.someItemCollapsed}
          onChange={bool => this.handleItemCollapse(filterObj.type, bool)}
          collapse={this.state.collapse[filterObj.type]}
        />
      );
    });


    return (
      <div className={classes.filtersBarWrap}>
        <div className={`${classes.filtersBar} filtersBar`}>
          {filtersComponents}
          <ImgColor
            showFiltersBar={showFiltersBar}
            collapse={this.state.collapse.color}
            someItemCollapsed={this.state.someItemCollapsed}
            onChange={bool => this.handleItemCollapse('color', bool)}
          />
        </div>
        <Divider />
        {/* add backdrop for mobile devices with touch screen && 'xs'-width */}
        {(mobileWithTouch && showFiltersBar && (width === 'xs')) ? <Backdrop onClose={() => this.props.onChange()} /> : null}
      </div>
    );
  }
}

SearchFilters.propTypes = {
  showFiltersBar: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  mobileWithTouch: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({ mobileWithTouch: state.appAdds.mobileWithTouch });
 
export default connect(mapStateToProps, {})(compose(withStyles(styles), withWidth())(SearchFilters));
