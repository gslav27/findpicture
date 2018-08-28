import * as types from "../actions/types";

const initialState = {
  open: false, 
  currentImgInd: -1,
  nextDataLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.VIEWER_OPEN:
      return {
        ...state,
        open: action.payload[0],
        currentImgInd: action.payload[1],
      }
    case types.VIEWER_LOAD_IMG:
      return {
        ...state,
        currentImgInd: action.payload,
        open: true,
        nextDataLoading: false,
      }
    case types.VIEWER_WAIT_API_RESPONSE:
      return {
        ...state,
        nextDataLoading: action.payload,
      }
    default:
      return state;
  }
}