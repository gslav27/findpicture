import { 
  VIEWER_LOAD_IMG,
  VIEWER_OPEN,
  VIEWER_WAIT_API_RESPONSE,
} from './types';

import { updateRecentlyWatched } from './appAddsAction';


export const fetchViewerOpen = (open, currentImgInd, isAuthenticated) => (dispatch) => {
  dispatch({
    type: VIEWER_OPEN,
    payload: [open, currentImgInd],
  });
  
  (open && isAuthenticated) ? dispatch(updateRecentlyWatched(currentImgInd)) : null;
}


export const fetchViewerImg = (newImgInd = null, isAuthenticated) => (dispatch, getState) => {
  if(newImgInd === null) {
    newImgInd = getState().imgViewer.currentImgInd + 1;
  }
  dispatch({
    type: VIEWER_LOAD_IMG,
    payload: newImgInd,
  });
  
  isAuthenticated ? dispatch(updateRecentlyWatched(newImgInd)) : null;
}


export const fetchWaitNextData = (loading = true) => {
  return {
    type: VIEWER_WAIT_API_RESPONSE,
    payload: loading,
  }
}