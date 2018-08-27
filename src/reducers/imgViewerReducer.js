import { 
  VIEWER_LOAD_IMG,
  VIEWER_OPEN,
  VIEWER_WAIT_API_RESPONSE,
} from '../actions/types';

const initialState = {
  open: false, 
  currentImgInd: -1,
  nextDataLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VIEWER_OPEN:
      return {
        ...state,
        open: action.payload[0],
        currentImgInd: action.payload[1],
      }
    case VIEWER_LOAD_IMG:
      return {
        ...state,
        currentImgInd: action.payload,
        open: true,
        nextDataLoading: false,
      }
    case VIEWER_WAIT_API_RESPONSE:
      return {
        ...state,
        nextDataLoading: action.payload,
      }
    default:
      return state;
  }
}