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
      return Object.assign({}, state, {
        favorites: action.payload.favorites,
        recentlyWatchedImgs: action.payload.recentlywatched,
      })
    case UPDATE_FAVORITES:
      return Object.assign({}, state, {
        favorites: action.payload,
      })
    case UPDATE_RECENTLY_WATCHED:
      return Object.assign({}, state, {
        recentlyWatchedImgs: action.payload,
      })
    case WINDOW_TOP:
      return Object.assign({}, state, {
        windowTop: action.payload,
      })
    case UPDATE_FAVORITES_ORDER:
      return Object.assign({}, state, {
        favorites: action.payload[0],
        favoritesOrderType: action.payload[1],
      })
    case WAIT_API_RESPONSE_TYPE_3:
      return Object.assign({}, state, {
        waitApiResponseUserHistory: action.payload,
      })
    case SET_AUTH_DIALOG_STATUS:
      return Object.assign({}, state, {
        authDialog: action.payload,
      })
    default:
      return state;
  }
}