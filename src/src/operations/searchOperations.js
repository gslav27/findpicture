import * as searchActions from '../actions/searchAction';
import * as imgViewerAction from './imgViewerOperations';


export const {
  fetchPage,
  fetchSearchText,
  fetchOrder,
  fetchOrientation,
  fetchImageType,
  fetchCategory,
  fetchColor,
  cutDownSearchStore,
} = searchActions;

export const fetchImages = (pathPage = 1) => (dispatch, getState) => {
  dispatch(searchActions.waitApiResponse());
  dispatch(searchActions.fetchPage(pathPage));
  const {
    searchText,
    amount,
    order,
    orientation,
    imageType,
    category,
    color,
    page,
  } = getState().search;
  fetch(`https://pixabay.com/api/?key=8913420-89429fef6031f24fd40903778&q=${searchText}&image_type=${imageType}&per_page=${amount}&order=${order}&orientation=${orientation}&category=${category}&colors=${color.join()}&safesearch=true&page=${page}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((response) => {
      window.scrollTo(0, 0);
      const { hits, total } = response;
      dispatch(searchActions.loadFetchedImages(hits, total));
    })
    .catch((error) => {
      console.log('There has been a problem with fetching more images: ', error.message);
      dispatch(searchActions.waitApiResponse(false));
    });
};


export const fetchAmount = (width, amount = null) => {
  let _amount;
  if (amount !== null) {
    _amount = amount;
  } else {
    switch (width) {
      case 'xl':
        _amount = 80;
        break;
      case 'lg':
      case 'md':
      case 'sm':
        _amount = 60;
        break;
      default:
        _amount = 30;
        break;
    }
  }
  return searchActions.setAmount(_amount);
};


export const fetchMoreImages = (wait = false, addAfter = true, prevPage = null) => (dispatch, getState) => {
  const loading = addAfter ? { previous: false, next: true } : { previous: true, next: false };
  dispatch(searchActions.waitApiResponse(loading, 2));
  const {
    searchText,
    amount,
    order,
    orientation,
    imageType,
    category,
    color,
  } = getState().search;
  let { page } = getState().search;
  (prevPage !== null) ? (page = prevPage) : null;
  fetch(`https://pixabay.com/api/?key=8913420-89429fef6031f24fd40903778&q=${searchText}&image_type=${imageType}&per_page=${amount}&order=${order}&orientation=${orientation}&category=${category}&colors=${color.join()}&safesearch=true&page=${page}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(response => dispatch(searchActions.loadMoreFetchedImages(response.hits, addAfter)))
    .then(() => {
      if (wait === true) {
        const newImgInd = addAfter ? null : (amount - 1);
        dispatch(imgViewerAction.fetchViewerImg(newImgInd));
      }
    })
    .catch((error) => {
      dispatch(imgViewerAction.fetchViewerOpen(false, -1));
      dispatch(imgViewerAction.fetchWaitNextData(false));
      console.log('There has been a problem with fetching more images: ', error.message);
    });
};
