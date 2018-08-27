import {
  UPDATE_RECENTLY_WATCHED,
  WINDOW_TOP,
  UPDATE_FAVORITES,
  UPDATE_FAVORITES_ORDER,
  UPDATE_USER_HISTORY,
  WAIT_API_RESPONSE_TYPE_3,
  SET_AUTH_DIALOG_STATUS,
} from '../actions/types';

// define mobile devices with touch screen
let _mobileWithTouch = (/Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent));

const initialState = {
  mobileWithTouch: _mobileWithTouch,
  favorites: [],
  recentlyWatchedImgs: [],
  windowTop: true,            
  favoritesOrderType: {
    addDate: [true, false],
    favorites: [false, false],
    comments: [false, false],
    downloads: [false, false],
  },
  waitApiResponseUserHistory: false,
  authDialog: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_HISTORY:
      return {
        ...state,
        favorites: action.payload.favorites,
        recentlyWatchedImgs: action.payload.recentlywatched,
      }
    case UPDATE_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      }
    case UPDATE_RECENTLY_WATCHED:
      return {
        ...state,
        recentlyWatchedImgs: action.payload,
      }
    case WINDOW_TOP:
      return {
        ...state,
        windowTop: action.payload,
      }
    case UPDATE_FAVORITES_ORDER:
      return {
        ...state,
        favorites: action.payload[0],
        favoritesOrderType: action.payload[1],
      }
    case WAIT_API_RESPONSE_TYPE_3:
      return {
        ...state,
        waitApiResponseUserHistory: action.payload,
      }
    case SET_AUTH_DIALOG_STATUS:
      return {
        ...state,
        authDialog: action.payload,
      }
    default:
      return state;
  }
}