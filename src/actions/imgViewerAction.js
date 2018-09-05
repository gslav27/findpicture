import * as types from './types';


export const setViewerOpen = (open, currentImgInd) => ({
  type: types.VIEWER_OPEN,
  payload: [open, currentImgInd],
});


export const setViewerImg = newImgInd => ({
  type: types.VIEWER_LOAD_IMG,
  payload: newImgInd,
});


export const fetchWaitNextData = (loading = true) => ({
  type: types.VIEWER_WAIT_API_RESPONSE,
  payload: loading,
});
