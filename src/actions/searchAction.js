import { 
  FETCH_IMAGES,
  FETCH_SEARCH_TEXT,
  FETCH_AMOUNT,
  FETCH_ORDER,
  FETCH_ORIENTATION,
  FETCH_IMAGE_TYPE,
  FETCH_CATEGORY,
  FETCH_COLOR,
  FETCH_PAGE,
  FETCH_MORE_IMAGES_NEXT_PAGE,
  FETCH_MORE_IMAGES_PREVIOUS_PAGE,
  CUT_DOWN_SEARCH_STORE,
  WAIT_API_RESPONSE_TYPE_1,
  WAIT_API_RESPONSE_TYPE_2,
} from './types';

import { fetchViewerImg, fetchViewerOpen, fetchWaitNextData } from './imgViewerAction';


// type "1" = fetchImages, type "2" = fetchMoreImages
const waitApiResponse = (loading = true, type = 1) => (dispatch) => {
  dispatch({
    type: (type === 1) ? WAIT_API_RESPONSE_TYPE_1 : WAIT_API_RESPONSE_TYPE_2,
    payload: loading,
  })
}


export const fetchImages = (pathPage = 1) => (dispatch, getState) => {
  dispatch(waitApiResponse()); 
  dispatch(fetchPage(pathPage));
  let {
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
    .then(response => {
      if (response.ok) {
        return response.json()
      }
    })
    .then(response => {
      window.scrollTo(0, 0);
      dispatch({
        type: FETCH_IMAGES,
        payload: [response.hits, response.total, false]
      });
    })
    .catch(function (error) {
      console.log('There has been a problem with fetching more images: ', error.message);
      dispatch(waitApiResponse(false));
    });
}


export const fetchSearchText = (input) => dispatch => {
  dispatch({
    type: FETCH_SEARCH_TEXT,
    payload: input,    
  })
}


export const fetchAmount = (width, amount=null) => dispatch => {
  let _amount;
  if (amount !== null) { 
    _amount = amount;
  } else {
    switch (true) {
      case (width === 'xl'):
        _amount = 80;
        break;
      case ((width === 'lg') || (width === 'md') || (width === 'sm')):
        _amount = 60;
        break;
      default:
        _amount = 30;
        break;
    }
  }
  dispatch({
    type: FETCH_AMOUNT,
    payload: _amount,
  })
}


export const fetchOrder = (input) => dispatch => {
  dispatch({
    type: FETCH_ORDER,
    payload: input,
  })
}


export const fetchOrientation = (input) => dispatch => {
  dispatch({
    type: FETCH_ORIENTATION,
    payload: input,
  })
}


export const fetchImageType = (input) => dispatch => {
  dispatch({
    type: FETCH_IMAGE_TYPE,
    payload: input,
  })
}


export const fetchCategory = (input) => dispatch => {
  dispatch({
    type: FETCH_CATEGORY,
    payload: input,
  })
}


export const fetchColor = (input = [null]) => dispatch => {
  dispatch({
    type: FETCH_COLOR,
    payload: input,
  })
}


export const fetchPage = (input) => dispatch => {
  dispatch({
    type: FETCH_PAGE,
    payload: input,
  })
}


export const fetchMoreImages = (wait = false, addAfter = true, prevPage = null) => (dispatch, getState) => {
  let loading = addAfter ? { previous: false, next: true } : { previous: true, next: false };
  dispatch(waitApiResponse(loading, 2))
  let {
    searchText,
    amount,
    order,
    orientation,
    imageType,
    category,
    color,
    page,
  } = getState().search;
  (prevPage !== null) ? (page = prevPage) : null;
  fetch(`https://pixabay.com/api/?key=8913420-89429fef6031f24fd40903778&q=${searchText}&image_type=${imageType}&per_page=${amount}&order=${order}&orientation=${orientation}&category=${category}&colors=${color.join()}&safesearch=true&page=${page}`)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
    })
    .then(response => dispatch({
      type: (addAfter ? FETCH_MORE_IMAGES_NEXT_PAGE : FETCH_MORE_IMAGES_PREVIOUS_PAGE),
      payload: response.hits
    })
    )
    .then(response => {
      if(wait === true){
        let newImgInd = addAfter ? null : (amount - 1);
        dispatch(fetchViewerImg(newImgInd))
      }
    })
    .catch(function (error) {
      dispatch(fetchViewerOpen(false, -1));
      dispatch(fetchWaitNextData(false));
      console.log('There has been a problem with fetching more images: ', error.message);
    });
}


export const cutDownSearchStore = () => dispatch => {
  dispatch({
    type: CUT_DOWN_SEARCH_STORE,
  })
}