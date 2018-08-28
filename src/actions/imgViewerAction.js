import * as types from "../actions/types";

import { updateRecentlyWatched } from './appAddsAction';


export const fetchViewerOpen = (open, currentImgInd, isAuthenticated) => (dispatch) => {
  dispatch({
    type: types.VIEWER_OPEN,
    payload: [open, currentImgInd],
  });
  
  (open && isAuthenticated) ? dispatch(updateRecentlyWatched(currentImgInd)) : null;
}


export const fetchViewerImg = (newImgInd = null, isAuthenticated) => (dispatch, getState) => {
  if(newImgInd === null) {
    newImgInd = getState().imgViewer.currentImgInd + 1;
  }
  dispatch({
    type: types.VIEWER_LOAD_IMG,
    payload: newImgInd,
  });
  
  isAuthenticated ? dispatch(updateRecentlyWatched(newImgInd)) : null;
}


export const fetchWaitNextData = (loading = true) => {
  return {
    type: types.VIEWER_WAIT_API_RESPONSE,
    payload: loading,
  }
}