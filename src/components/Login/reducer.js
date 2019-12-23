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
  isLoading: false,
  asyncError: ""
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return { ...state, isLoading: true, asyncError: "" };

    case LOGIN_SUCCEDED:
      if (!action.user) {
        return { ...state, isLoading: false };
      } else {
        return initialState;
      }

    case LOGIN_FAILED:
      return { isLoading: false, asyncError: action.error };

    default:
      return state;
  }
};

export default loginReducer;

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
