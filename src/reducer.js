/* reducer */
import * as actionTypes from "./actions.js";
import { combineReducers } from "redux";

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const userData = (state = initialUserState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_USER:
      return {
        currentUser: payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        currentUser: null,
        isLoading: false
      };
    default:
      return state;
  }
};

const channels = (state = [], action) => {
  if (action.type === actionTypes.LOAD_CHANNELS) {
    return [...state, action.channel];
  }
  return state;
};

const rootReducer = combineReducers({
  userData,
  channels
});
export default rootReducer;
