import * as types from './types';


// type "1" = fetchImages, type "2" = fetchMoreImages
export const waitApiResponse = (loading = true, type = 1) => ({
  type: (type === 1) ? types.WAIT_API_RESPONSE_TYPE_1 : types.WAIT_API_RESPONSE_TYPE_2,
  payload: loading,
});


export const fetchPage = input => ({
  type: types.FETCH_PAGE,
  payload: input,
});


export const loadFetchedImages = (hits, total) => ({
  type: types.FETCH_IMAGES,
  payload: [hits, total],
});


export const fetchSearchText = input => ({
  type: types.FETCH_SEARCH_TEXT,
  payload: input,
});


export const setAmount = amount => ({
  type: types.FETCH_AMOUNT,
  payload: amount,
});


export const fetchOrder = input => ({
  type: types.FETCH_ORDER,
  payload: input,
});


export const fetchOrientation = input => ({
  type: types.FETCH_ORIENTATION,
  payload: input,
});


export const fetchImageType = input => ({
  type: types.FETCH_IMAGE_TYPE,
  payload: input,
});


export const fetchCategory = input => ({
  type: types.FETCH_CATEGORY,
  payload: input,
});


export const fetchColor = (input = [null]) => ({
  type: types.FETCH_COLOR,
  payload: input,
});


export const loadMoreFetchedImages = (hits, addAfter) => ({
  type: addAfter ? types.FETCH_MORE_IMAGES_NEXT_PAGE : types.FETCH_MORE_IMAGES_PREVIOUS_PAGE,
  payload: hits,
});


export const cutDownSearchStore = () => ({ type: types.CUT_DOWN_SEARCH_STORE });
