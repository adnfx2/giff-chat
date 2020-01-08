const USER_ADDED = "users/userAdded";
const USER_REMOVED = "users/userRemoved";
const USERS_RESET = "users/reset";
const USER_PRESENCE_UPDATED = "users/userPresenceUpdated";

const userAdded = user => ({
  type: USER_ADDED,
  user
});

const userRemoved = userId => ({
  type: USER_REMOVED,
  userId
});

const usersReset = () => ({
  type: USERS_RESET
});

const userPresenceUpdated = (userId, isConnected) => ({
  type: USER_PRESENCE_UPDATED,
  userId,
  isConnected
});

const defaultUsersState = {
  byId: {},
  allIds: [],
  presence: {}
};

const removeKey = (key, obj) => {
  const _obj = { ...obj };
  delete obj[key];
  return _obj;
};

const usersReducer = (state = defaultUsersState, action) => {
  switch (action.type) {
    case USER_ADDED: {
      const { user } = action;

      return {
        ...state,
        byId: { ...state.byId, [user.uid]: user },
        allIds: [...state.allIds, user.uid]
      };
    }
    case USER_REMOVED: {
      const { user } = action;
      const _byId = removeKey(user.uid, state.byId);
      const _allIds = state.ids.filter(id => id !== user.uid);
      return { ...state, byId: _byId, allIds: _allIds };
    }
    case USER_PRESENCE_UPDATED: {
      const { userId, isConnected } = action;
      return {
        ...state,
        presence: { ...state.presence, [userId]: isConnected }
      };
    }
    case USERS_RESET:
      return defaultUsersState;
    default:
      return state;
  }
};

export default usersReducer;

export const actionTypes = {
  USER_ADDED,
  USER_REMOVED,
  USER_PRESENCE_UPDATED,
  USERS_RESET
};

export const actions = {
  userAdded,
  userRemoved,
  userPresenceUpdated,
  usersReset
};
