import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import searchFiltersStyle from './SearchFilters.style';

import FiltersTemplate from './components/FiltersTemplate/FiltersTemplate';
import ImgColor from './components/ColorFilter/ColorFilter';
import Backdrop from '../../../../UI/Backdrop';

import Divider from '@material-ui/core/Divider';


const styles = (theme) => (searchFiltersStyle(theme));
  

const filtersProps = {
  order: {
    type: 'order',
    options: ['popular', 'latest'],
    label: 'order by',
    allOptions: false,
  },
  orientation: {
    type: 'orientation',
    options: ['horizontal', 'vertical',],
    label: 'orientation',
    allOptions: true,
  },
  type: {
    type: 'imageType',
    options: ['photo', 'illustration', 'vector',],
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
    }
  }


  static getDerivedStateFromProps = (props, state) => {
    (props.showFiltersBar !== true) ? (state.someItemCollapsed = false) : null;
    return null
  }


  componentWillUnmount = () => {
    (this.props.width === 'xs') ? this.props.onChange() : null;
  }
  

  handleItemCollapse = (filter, val) => {
    // create new copy of this.state.collapse with all 'filters' set to 'false'
    let newState = {};
    for (const key in this.state.collapse) {
      newState[key] = false;
    };
    // set current collapse value of handled filter
    newState[filter] = val;
    // update this.state.collapse
    this.setState({
      collapse: newState,
      someItemCollapsed: val ? true : false,
    });
  }


  render() {
    const { classes, showFiltersBar, mobileWithTouch, width } = this.props;

    
    const filtersComponents = Object.keys(filtersProps).map(filterType => {
      let filterObj = filtersProps[filterType];
      return (
        <FiltersTemplate
          key={filterObj.type}
          filter={filterObj}
          showFiltersBar={showFiltersBar}
          someItemCollapsed={this.state.someItemCollapsed}
          onChange={(val) => this.handleItemCollapse(filterObj.type, val)}
          collapse={this.state.collapse[filterObj.type]}
        />
      )
    })


    return (
      <div className={classes.filtersBarWrap}>
        <div className={`${classes.filtersBar} filtersBar`}>
          {filtersComponents}
          <ImgColor 
            showFiltersBar={showFiltersBar}
            collapse={this.state.collapse.color} 
            someItemCollapsed={this.state.someItemCollapsed} 
            onChange={(val) => this.handleItemCollapse('color', val)} 
          />
        </div>
        <Divider />
        {/* add backdrop for mobile devices with touch screen && 'xs'-width */}
        {(mobileWithTouch && showFiltersBar && (width==='xs')) ?<Backdrop onClose={()=>this.props.onChange()}/> : null}
      </div>
    )
  }
}

SearchFilters.propTypes = {
  showFiltersBar: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  mobileWithTouch: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  mobileWithTouch: state.appAdds.mobileWithTouch,
})

export default connect(mapStateToProps, {})(compose(withStyles(styles), withWidth(), )(SearchFilters))