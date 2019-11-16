/* action types*/
export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
export const SET_CHANNEL = "SET_CHANNEL";
export const LOAD_CHANNEL = "LOAD_CHANNEL";
export const LOAD_MESSAGE = "LOAD_MESSAGE";

/* action creator */
export const setUser = user => ({
  type: SET_USER,
  payload: { currentUser: user }
});

export const clearUser = () => ({
  type: CLEAR_USER
});

export const loadChannel = incommingChannel => ({
  type: LOAD_CHANNEL,
  incommingChannel
});

export const loadMessage = incommingMessage => ({
  type: LOAD_MESSAGE,
  incommingMessage
});

export const setChannel = channelId => ({
  type: SET_CHANNEL,
  channelId
});
