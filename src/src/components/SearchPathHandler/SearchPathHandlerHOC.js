import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';

import {
  fetchImages,
  fetchAmount,
  fetchOrder,
  fetchCategory,
  fetchColor,
  fetchImageType,
  fetchOrientation,
  fetchPage,
  fetchSearchText,
} from '../../operations/searchOperations';
import { fetchViewerOpen } from '../../operations/imgViewerOperations';

import { auth } from '../Auth/AuthHOC';



// for calculating whole document height & windowHeight (in handleScroll())
const { body } = document;
const html = document.documentElement;
const getDocHeight = () => Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);


const withSearchPathHandler = (WrappedComponent) => {
  class HOC extends Component {
    constructor(props) {
      super(props);
      this.handleScroll = this.handleScroll.bind(this);
      this.handleScrollThrottled = throttle(this.handleScroll, 250);
    }

    componentDidMount() {
      // handle URL location if search options already specified (if its someones link, page was reloaded, etc)
      const { params } = this.props.match;
      (params.query !== undefined) ? this.handleSearchPath(params.query) : this.updateSearchPath();
      (params.page !== undefined) ? this.props.fetchImages(Number(params.page)) : (this.props.fetchAmount(this.props.width), this.props.fetchImages());

      window.addEventListener('scroll', this.handleScrollThrottled);
    }


    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScrollThrottled);
    }


    componentDidUpdate = (prevProps) => {
      const {
        searchText,
        order,
        orientation,
        imageType,
        category,
        color,
        page,
        amount,
        waitApiResponseMoreImages,
        open,
        waitApiResponseImages,
        match,
        currentImgInd,
        location,
      } = this.props;
      // update URL location on fetching user input, filter changes
      if (
        !open && ((searchText !== prevProps.searchText) ||
        (order !== prevProps.order) ||
        (orientation !== prevProps.orientation) ||
        (imageType !== prevProps.imageType) ||
        (category !== prevProps.category) ||
        ((color.length !== prevProps.color.length) || (color[0] !== prevProps.color[0])) ||
        (page !== prevProps.page))
      ) {
        this.updateSearchPath();
      }
      // update URL location when user click on 'Home' button (in Drawer) from 'SearchResults'-page (from Home page)
      ((prevProps.match.params.query !== undefined) && (location.pathname === '/findpicture/'))
        ? this.updateSearchPath()
        : null;
      // update URL location (using handleScroll() option) after Image Viewer was closed or next images was loaded
      (((open !== prevProps.open) && !open) || ((waitApiResponseMoreImages.next !== prevProps.waitApiResponseMoreImages.next) && !waitApiResponseMoreImages.next))
        ? this.handleScroll()
        : null;
      // open Image Viewer if URL location have data about some opened images (in this.props.match.params.viewer) and application just loaded (waitApiResponseImages checking)
      ((waitApiResponseImages !== prevProps.waitApiResponseImages) && !waitApiResponseImages && (match.params.viewer !== undefined))
        ? this.props.fetchViewerOpen(true, ((Number(match.params.viewer) - 1) - (page * amount - amount)), auth.isAuthenticated())
        : null;
      
      (currentImgInd !== prevProps.currentImgInd && ~currentImgInd)
        ? (this.updateViewerPath(), ((page === 1) ? (setTimeout(() => { this.updateSearchPath(); }, 100)) : null))
        : null;
    }


    handleSearchPath = (searchPath) => {
      // searchPath is part of URL, for example:
      // URL = 'findpicture/q_sky&order=latest&color=green,red&q=30'
      // searchPath = 'sky&order=latest&color=green,red&q=30'
      const searchParameters = searchPath.split('&'); // searchParameters = [ 'sky', 'order=latest', 'color=green,red', 'q=30' ]
      searchParameters.forEach((parameter, index) => {
        const filter = parameter.split('=');
        if (filter.length === 1) {
          (index === 0) ? this.props.fetchSearchText(filter[0]) : null; // filter = ['sky']
        } else if (filter[0] === 'q') {                                 // filter = ['q=30']
          this.props.fetchAmount(null, Number(filter[1]));
        } else {                                                        // filter = ['order=latest'] or ['color=green,red']
          const filterHandler = `fetch${filter[0][0].toUpperCase()}${filter[0].slice(1)}`;
          const filterValue = (filter[0] !== 'color') ? filter[1] : (filter[1]).split(',');
          this.props[filterHandler](filterValue);
        }
      });
    }


    updateSearchPath = () => {
      const {
        searchText,
        order,
        orientation,
        imageType,
        category,
        color,
        page,
        amount,
        history,
      } = this.props;
      const { viewer } = this.props.match.params;
      
      // create new string which could be used for URL location update if there are custom search query
      let urlQuery = '';
      // check if search query options isn't default and update 'urlQuery' if its true
      if (searchText !== '') { urlQuery += searchText; }
      if (order !== 'popular') { urlQuery += `&order=${order}`; }
      if (orientation !== 'horizontal') { urlQuery += `&orientation=${orientation}`; }
      if (imageType !== 'photo') { urlQuery += `&imageType=${imageType}`; }
      if (category !== '') { urlQuery += `&category=${category}`; }
      if (color[0] !== null) { urlQuery += `&color=${color}`; }
      if ((page !== 1) || (viewer !== undefined)) { urlQuery += `&q=${amount}/${page}`; }
      if (viewer !== undefined) { urlQuery += `/${viewer}`; }

      // check if there are custom search query and update URL location if its true
      (urlQuery !== '')
        ? history.push(`/findpicture/q_${urlQuery}`)
        : history.push('/findpicture');
    }


    updateViewerPath = () => {
      const { currentImgInd, images, page, amount, match, history } = this.props;
      let historyPath = (match.params.query === undefined)
        ? `/findpicture/q_&q=${amount}`
        : `/findpicture/q_${match.params.query}`;
      const currentImgNum = currentImgInd + 1 + (page - Math.ceil(images.length / amount)) * amount;
      if (currentImgInd !== -1) { historyPath += `/${Math.ceil(currentImgNum / amount)}/${currentImgNum}`; }
      history.push(historyPath);
    }


    handleScroll() {
      const { page, amount, images, history, match, open } = this.props;
      // get height of the window
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
      // calcualte path page height (*/*/:page?)
      const pathPageHeight = getDocHeight() / (images.length / amount);
      // calculate currentWindowYOffset
      const windowYOffset = window.pageYOffset + (windowHeight - 200);

      // calculate currentPathPageYOffset parameters (for setting current page in URL on scroll)
      let currentPathPageStart;
      const currentPathPage = Number((match.params.page !== undefined) ? match.params.page : 1);
      // set currentPathPage start&end bounds depends on number of loaded pages from API
      const fetchedPages = Math.ceil(images.length / amount);
      if (fetchedPages === page) { // pages from API was loaded from the 1st page
        currentPathPageStart = pathPageHeight * (currentPathPage - 1);
      } else {
        currentPathPageStart = pathPageHeight * (currentPathPage - 1 - (page - fetchedPages));
      }
      const currentPathPageEnd = currentPathPageStart + pathPageHeight;
      const pathQuery = (match.params.query === undefined) ? '' : match.params.query;
      // change URL page parameter only when Image Viewer is closed
      if (!open) {
        if ((windowYOffset > currentPathPageEnd)) {
          const newPath = `/findpicture/q_${pathQuery}/${currentPathPage + 1}`;
          history.push(newPath);
        } else if (windowYOffset < currentPathPageStart) {
          const newPath = `/findpicture/q_${pathQuery}/${currentPathPage - 1}`;
          history.push(newPath);
        } else if (match.params.viewer !== undefined) {
          const newPath = `/findpicture/q_${pathQuery}/${currentPathPage}`;
          history.push(newPath);
        }
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    images: state.search.images,
    page: state.search.page,
    orientation: state.search.orientation,
    open: state.imgViewer.open,
    searchText: state.search.searchText,
    waitApiResponseImages: state.search.waitApiResponseImages,
    waitApiResponseMoreImages: state.search.waitApiResponseMoreImages,
    order: state.search.order,
    imageType: state.search.imageType,
    category: state.search.category,
    color: state.search.color,
    amount: state.search.amount,
    currentImgInd: state.imgViewer.currentImgInd,
  });

  const mapDispatchToProps = {
    fetchImages,
    fetchPage,
    fetchViewerOpen,
    fetchSearchText,
    fetchAmount,
    fetchOrder,
    fetchCategory,
    fetchColor,
    fetchImageType,
    fetchOrientation,
  };
  
  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};


withSearchPathHandler.propTypes = {
  fetchImages: PropTypes.func.isRequired,
  fetchPage: PropTypes.func.isRequired,
  fetchViewerOpen: PropTypes.func.isRequired,
  fetchSearchText: PropTypes.func.isRequired,
  fetchAmount: PropTypes.func.isRequired,
  fetchOrder: PropTypes.func.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  fetchColor: PropTypes.func.isRequired,
  fetchImageType: PropTypes.func.isRequired,
  fetchOrientation: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  orientation: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  waitApiResponseImages: PropTypes.bool,
  waitApiResponseMoreImages: PropTypes.object,
  currentImgInd: PropTypes.number,
  order: PropTypes.string.isRequired,
  imageType: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  color: PropTypes.array.isRequired,
};


export default withSearchPathHandler;
