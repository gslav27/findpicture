import { combineReducers } from 'redux';
import searchReducer from './searchReducer';
import imgViewerReduser from './imgViewerReducer';
import appAddsReducer from './appAddsReducer';

import { routerReducer } from 'react-router-redux';

export default combineReducers({
  search: searchReducer,
  imgViewer: imgViewerReduser,
  appAdds: appAddsReducer,
  routing: routerReducer,
})