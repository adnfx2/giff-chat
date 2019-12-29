/* action types*/
export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
export const SET_CHANNEL = "SET_CHANNEL";
export const LOAD_CHANNEL = "LOAD_CHANNEL";
export const LOAD_MESSAGE = "LOAD_MESSAGE";
export const LOAD_USERS = "LOAD_USERS";
export const UPDATE_USER = "UPDATE_USER";
export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
export const TOGGLE_STAR = "TOGGLE_STAR";

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

export const loadMessage = (incommingMessages, channelId, uniqueUsers) => ({
  type: LOAD_MESSAGE,
  channelId,
  incommingMessages,
  uniqueUsers
});

export const setChannel = (channel, privateChannel = false) => ({
  type: SET_CHANNEL,
  channel,
  privateChannel
});

export const loadUsers = users => ({
  type: LOAD_USERS,
  users
});

export const updateUser = (userId, connected = true) => ({
  type: UPDATE_USER,
  userId,
  connected
});

export const setNotifications = notifications => ({
  type: SET_NOTIFICATIONS,
  notifications
});

export const toggleStar = channelId => ({
  type: TOGGLE_STAR,
  channelId
});
