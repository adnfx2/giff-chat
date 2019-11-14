/* action types*/
export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
export const LOAD_CHANNELS = "LOAD_CHANNELS";

/* action creator */
export const setUser = user => ({
  type: SET_USER,
  payload: { currentUser: user }
});

export const clearUser = () => ({
  type: CLEAR_USER
});

export const loadChannels = channel => ({
  type: LOAD_CHANNELS,
  channel
});
