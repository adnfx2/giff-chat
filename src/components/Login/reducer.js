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

const initialState = {
  user: {},
  isLoading: false,
  asyncError: ""
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return { ...state, user: {}, isLoading: true };
    case LOGIN_SUCCEDED:
      if (!action.user) {
        return { ...state, isLoading: false };
      } else {
        return { user: action.user, isLoading: false, asyncError: "" };
      }
    case LOGIN_FAILED:
      return { user: {}, isLoading: false, asyncError: action.error };
    default:
      return state;
  }
};

export default authReducer;

export const actionTypes = {
  LOGIN_REQUESTED,
  LOGIN_SUCCEDED,
  LOGIN_FAILED
};

export const actions = {
  loginRequested,
  loginSucceded,
  loginFailed
};
