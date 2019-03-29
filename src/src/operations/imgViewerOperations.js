import * as imgViewerAction from '../actions/imgViewerAction';
import { updateRecentlyWatched } from './appAddsOperations';


export const { fetchWaitNextData } = imgViewerAction;

export const fetchViewerOpen = (open, currentImgInd, isAuthenticated) => (dispatch) => {
  dispatch(imgViewerAction.setViewerOpen(open, currentImgInd));
  (open && isAuthenticated) && dispatch(updateRecentlyWatched(currentImgInd));
};


export const fetchViewerImg = (newImgInd = null, isAuthenticated) => (dispatch, getState) => {
  if (newImgInd === null) {
    newImgInd = getState().imgViewer.currentImgInd + 1;
  }
  dispatch(imgViewerAction.setViewerImg(newImgInd));
  isAuthenticated && dispatch(updateRecentlyWatched(newImgInd));
};
