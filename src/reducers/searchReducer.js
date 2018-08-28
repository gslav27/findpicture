import * as types from "../actions/types";

const initialState = {
  searchText: '',
  order: 'popular',
  orientation: 'horizontal',
  imageType: 'photo',
  category: '',
  color: [null],
  images: [],
  page: 1,
  total: 0,
  amount: 30,
  waitApiResponseImages: false,
  waitApiResponseMoreImages: {previous: false, next: false},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      }
    case types.FETCH_IMAGES:
      return {
        ...state,
        images: action.payload[0],
        total: action.payload[1],
        waitApiResponseImages: false,
      }
    case types.FETCH_AMOUNT:
      return {
        ...state,
        amount: action.payload,
      }
    case types.FETCH_ORDER:
      return {
        ...state,
        order: action.payload,
      } 
    case types.FETCH_ORIENTATION:
      return {
        ...state,
        orientation: action.payload,
      }
    case types.FETCH_IMAGE_TYPE:
      return {
        ...state,
        imageType: action.payload,
      }
    case types.FETCH_CATEGORY:
      return {
        ...state,
        category: action.payload,
      }
    case types.FETCH_COLOR:
      return {
        ...state,
        color: action.payload,
      }
    case types.FETCH_PAGE:
      return {
        ...state,
        page: action.payload,
      }
    case types.FETCH_MORE_IMAGES_NEXT_PAGE:
      return {
        ...state,
        images: state.images.concat(action.payload),
        waitApiResponseMoreImages: { previous: false, next: false },
      }
    case types.FETCH_MORE_IMAGES_PREVIOUS_PAGE:
      return {
        ...state,
        images: action.payload.concat(state.images),
        waitApiResponseMoreImages: { previous: false, next: false },
      }
    case types.CUT_DOWN_SEARCH_STORE:
      return {
        ...state,
        images: state.images.slice(0, state.amount),
        page: 1,
      }
    case types.WAIT_API_RESPONSE_TYPE_1:
      return {
        ...state,
        waitApiResponseImages: action.payload,
      }
    case types.WAIT_API_RESPONSE_TYPE_2:
      return {
        ...state,
        waitApiResponseMoreImages: action.payload,
      }
    default:
      return state;
  }
}