import { combineReducers } from "redux";
import loginReducer from "../components/Login/reducer";
import registerReducer from "../components/Register/reducer";

const USER_CHANGED = "auth/userChanged";
const USER_REMOVED = "auth/userRemoved";

const userChanged = user => ({
  type: USER_CHANGED,
  user
});

const userRemoved = user => ({
  type: USER_REMOVED
});

const initialState = {
  user: {},
  isLoading: true
};

const userReducer = (state = initialState, action) => {
  if (action.type === USER_CHANGED) {
    return { ...state, user: action.user, isLoading: false };
  }

  if (action.type === USER_REMOVED) {
    return { ...state, user: {}, isLoading: false };
  }

  return state;
};

const authReducer = combineReducers({
  user: userReducer,
  login: loginReducer,
  register: registerReducer
});

export default authReducer;

export const actionTypes = {
  USER_CHANGED,
  USER_REMOVED
};

export const actions = {
  userChanged,
  userRemoved
};
