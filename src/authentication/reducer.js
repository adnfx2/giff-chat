import { combineReducers } from "redux";

// RegisterReducer

const REGISTER_REQUESTED = "auth/registerRequested";
const REGISTER_SUCCEDED = "auth/registerSucceded";
const REGISTER_FAILED = "auth/registerFailed";

const registerRequested = () => ({
  type: REGISTER_REQUESTED
});

const registerSucceded = user => ({
  type: REGISTER_SUCCEDED
});

const registerFailed = error => ({
  type: REGISTER_FAILED,
  error
});

const defaultRegisterState = {
  isLoading: false,
  asyncError: ""
};

const registerReducer = (state = defaultRegisterState, action) => {
  switch (action.type) {
    case REGISTER_REQUESTED:
      return { ...state, isLoading: true, asyncError: "" };

    case REGISTER_SUCCEDED:
      return defaultRegisterState;

    case REGISTER_FAILED:
      return { ...state, isLoading: false, asyncError: action.error };

    default:
      return state;
  }
};

// LoginReducer

const LOGIN_REQUESTED = "auth/loginRequested";
const LOGIN_SUCCEDED = "auth/loginSucceded";
const LOGIN_FAILED = "auth/loginFailed";

const loginRequested = () => ({
  type: LOGIN_REQUESTED
});

const loginSucceded = user => ({
  type: LOGIN_SUCCEDED,
  user
});

const loginFailed = error => ({
  type: LOGIN_FAILED,
  error
});

const defaultLoginState = {
  isLoading: false,
  asyncError: ""
};

const loginReducer = (state = defaultLoginState, action) => {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return { ...state, isLoading: true, asyncError: "" };

    case LOGIN_SUCCEDED:
      if (!action.user) {
        return { ...state, isLoading: false };
      } else {
        return defaultLoginState;
      }

    case LOGIN_FAILED:
      return { isLoading: false, asyncError: action.error };

    default:
      return state;
  }
};

// UserReducer

const USER_CHANGED = "auth/userChanged";
const USER_REMOVED = "auth/userRemoved";

const userChanged = user => ({
  type: USER_CHANGED,
  user
});

const userRemoved = user => ({
  type: USER_REMOVED
});

const defaultUserState = {
  userProfile: {},
  isLoading: true
};

const userReducer = (state = defaultUserState, action) => {
  if (action.type === USER_CHANGED) {
    return { ...state, userProfile: action.user, isLoading: false };
  }

  if (action.type === USER_REMOVED) {
    return { ...state, userProfile: {}, isLoading: false };
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
  REGISTER_REQUESTED,
  REGISTER_SUCCEDED,
  REGISTER_FAILED,
  LOGIN_REQUESTED,
  LOGIN_SUCCEDED,
  LOGIN_FAILED,
  USER_CHANGED,
  USER_REMOVED
};

export const actions = {
  registerRequested,
  registerSucceded,
  registerFailed,
  loginRequested,
  loginSucceded,
  loginFailed,
  userChanged,
  userRemoved
};
