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
} from '../actions/types';

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
    case FETCH_SEARCH_TEXT:
      return Object.assign({}, state, {
        searchText: action.payload,
      })
    case FETCH_IMAGES:
      return Object.assign({}, state, {
        images: action.payload[0],
        total: action.payload[1],
        waitApiResponseImages: false,
      })
    case FETCH_AMOUNT:
      return Object.assign({}, state, {
        amount: action.payload,
      })
    case FETCH_ORDER:
      return Object.assign({}, state, {
        order: action.payload,
      }) 
    case FETCH_ORIENTATION:
      return Object.assign({}, state, {
        orientation: action.payload,
      }) 
    case FETCH_IMAGE_TYPE:
      return Object.assign({}, state, {
        imageType: action.payload,
      })
    case FETCH_CATEGORY:
      return Object.assign({}, state, {
        category: action.payload,
      })
    case FETCH_COLOR:
      return Object.assign({}, state, {
        color: action.payload,
      })
    case FETCH_PAGE:
      return Object.assign({}, state, {
        page: action.payload,
      })
    case FETCH_MORE_IMAGES_NEXT_PAGE:
      return Object.assign({}, state, {
        images: state.images.concat(action.payload),
        waitApiResponseMoreImages: { previous: false, next: false },
      })
    case FETCH_MORE_IMAGES_PREVIOUS_PAGE:
      return Object.assign({}, state, {
        images: action.payload.concat(state.images),
        waitApiResponseMoreImages: { previous: false, next: false },
      })
    case CUT_DOWN_SEARCH_STORE:
      return Object.assign({}, state, {
        images: state.images.slice(0, state.amount),
        page: 1,
      })
    case WAIT_API_RESPONSE_TYPE_1:
      return Object.assign({}, state, {
        waitApiResponseImages: action.payload,
      })
    case WAIT_API_RESPONSE_TYPE_2:
      return Object.assign({}, state, {
        waitApiResponseMoreImages: action.payload,
      })
    default:
      return state;
  }
}