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

const initialState = {
  isLoading: false,
  asyncError: ""
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUESTED:
      return { ...state, isLoading: true, asyncError: "" };

    case REGISTER_SUCCEDED:
      return initialState;

    case REGISTER_FAILED:
      return { ...state, isLoading: false, asyncError: action.error };

    default:
      return state;
  }
};

export default registerReducer;

export const actionTypes = {
  REGISTER_REQUESTED,
  REGISTER_SUCCEDED,
  REGISTER_FAILED
};

export const actions = {
  registerRequested,
  registerSucceded,
  registerFailed
};
