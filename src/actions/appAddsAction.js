import * as types from './types';


export const waitApiResponse = (loading = true) => ({
  type: types.WAIT_API_RESPONSE_TYPE_3,
  payload: loading,
});


export const authDialogOpen = (open = true) => ({
  type: types.SET_AUTH_DIALOG_STATUS,
  payload: open,
});


export const loadUserHistory = data => ({
  type: types.UPDATE_USER_HISTORY,
  payload: data,
});


export const clearUserHistory = () => ({
  type: types.UPDATE_USER_HISTORY,
  payload: { favorites: [], recentlywatched: [] },
});


export const loadFavorites = images => ({
  type: types.UPDATE_FAVORITES,
  payload: images,
});


export const loadRecentlyWatched = images => ({
  type: types.UPDATE_RECENTLY_WATCHED,
  payload: images,
});


export const setWindowTop = (current = true) => ({
  type: types.WINDOW_TOP,
  payload: current,
});


export const setFavoritesOrder = images => ({
  type: types.UPDATE_FAVORITES_ORDER,
  payload: images,
});
