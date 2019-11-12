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
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  userData
});

export default rootReducer;
