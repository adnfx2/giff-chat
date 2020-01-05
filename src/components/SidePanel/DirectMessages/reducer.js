import { combineReducers } from "redux";

const USER_ADDED = "users/userAdded";
const USER_PRESENCE_UPDATED = "users/userPresenceUpdated";
const USER_REMOVED = "users/userRemoved";
const USERS_CLEARED = "users/usersCleared";

const userAdded = user => ({
  type: USER_ADDED,
  user
});

const userRemoved = userId => ({
  type: USER_REMOVED,
  userId
});

const userPresenceUpdated = (userId, isConnected) => ({
  type: USER_PRESENCE_UPDATED,
  userId,
  isConnected
});

const usersCleared = () => ({
  type: USERS_CLEARED
});

const defaultUsersState = {};

const usersByIdReducer = (state = defaultUsersState, action) => {
  switch (action.type) {
    case USER_ADDED: {
      const { user } = action;
      return { ...state, [user.uid]: user };
    }
    case USER_REMOVED: {
      const { userId } = action;
      const users = { ...state };
      delete users[userId];
      return users;
    }
    case USERS_CLEARED: {
      return defaultUsersState;
    }
    default:
      return state;
  }
};

const defaultPresenceState = {};

const presenceReducer = (state = defaultPresenceState, action) => {
  switch (action.type) {
    case USER_PRESENCE_UPDATED: {
      const { userId, isConnected } = action;
      return { ...state, [userId]: isConnected };
    }
    case USERS_CLEARED: {
      return defaultPresenceState;
    }
    default:
      return state;
  }
};

const usersReducer = combineReducers({
  usersById: usersByIdReducer,
  presenceByUserId: presenceReducer
});

export default usersReducer;

export const actionTypes = {
  USER_ADDED,
  USER_REMOVED,
  USER_PRESENCE_UPDATED,
  USERS_CLEARED
};

export const actions = {
  userAdded,
  userRemoved,
  userPresenceUpdated,
  usersCleared
};
