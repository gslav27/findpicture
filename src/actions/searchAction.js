import * as types from "../actions/types";

import { fetchViewerImg, fetchViewerOpen, fetchWaitNextData } from './imgViewerAction';


// type "1" = fetchImages, type "2" = fetchMoreImages
const waitApiResponse = (loading = true, type = 1) => {
  return {
    type: (type === 1) ? types.WAIT_API_RESPONSE_TYPE_1 : types.WAIT_API_RESPONSE_TYPE_2,
    payload: loading,
  };
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
        type: types.FETCH_IMAGES,
        payload: [response.hits, response.total, false]
      });
    })
    .catch(function (error) {
      console.log('There has been a problem with fetching more images: ', error.message);
      dispatch(waitApiResponse(false));
    });
}


// export const fetchSearchText = (input) => dispatch => {
export const fetchSearchText = (input) => {
  return {
    type: types.FETCH_SEARCH_TEXT,
    payload: input,    
  };
}


export const fetchAmount = (width, amount=null) => {
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
  return {
    type: types.FETCH_AMOUNT,
    payload: _amount,
  };
}


export const fetchOrder = (input) => {
  return {
    type: types.FETCH_ORDER,
    payload: input,
  };
}


export const fetchOrientation = (input) => {
  return {
    type: types.FETCH_ORIENTATION,
    payload: input,
  };
}


export const fetchImageType = (input) => {
  return {
    type: types.FETCH_IMAGE_TYPE,
    payload: input,
  };
}


export const fetchCategory = (input) => {
  return {
    type: types.FETCH_CATEGORY,
    payload: input,
  };
}


export const fetchColor = (input = [null]) => {
  return {
    type: types.FETCH_COLOR,
    payload: input,
  };
}


export const fetchPage = (input) => {
  return {
    type: types.FETCH_PAGE,
    payload: input,
  };
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
      type: (addAfter ? types.FETCH_MORE_IMAGES_NEXT_PAGE : types.FETCH_MORE_IMAGES_PREVIOUS_PAGE),
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


export const cutDownSearchStore = () => {
  return {
    type: types.CUT_DOWN_SEARCH_STORE,
  };
}