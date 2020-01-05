/* reducer */
import * as actionTypes from "./actions";
import { combineReducers } from "redux";
import auth from "./authentication/reducer";
import publicChannels from "./components/SidePanel/Channels/reducer";
import starredChannelsById from "./components/SidePanel/Starreds/reducer";
import users from './components/SidePanel/DirectMessages/reducer';

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const userData = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        currentUser: null,
        isLoading: false
      };
    default:
      return state;
  }
};

const initialChannelState = {
  selectedChannel: "",
  privateChannel: false,
  loadedChannels: []
};

const channels = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_CHANNEL:
      const { loadedChannels } = state;
      return {
        ...state,
        loadedChannels: [...loadedChannels, action.incommingChannel]
      };
    case actionTypes.SET_CHANNEL:
      return {
        ...state,
        selectedChannel: action.channel,
        privateChannel: action.privateChannel
      };
    default:
      return state;
  }
};

const initialMessagesState = {
  byChannelId: {}
};

const messages = (state = initialMessagesState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_MESSAGE:
      const { byChannelId } = state;
      const { channelId, incommingMessages, uniqueUsers } = action;

      return {
        ...state,
        byChannelId: {
          ...byChannelId,
          [channelId]: {
            members: uniqueUsers,
            messages: incommingMessages
          }
        }
      };
    default:
      return state;
  }
};

const uusers = (users = [], action) => {
  switch (action.type) {
    case actionTypes.LOAD_USERS:
      return action.users;
    case actionTypes.UPDATE_USER:
      return users.map(user =>
        user.uid === action.userId
          ? { ...user, status: action.connected ? "online" : "offline" }
          : user
      );
    default:
      return users;
  }
};

const notifications = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.SET_NOTIFICATIONS:
      return action.notifications;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth,
  users,
  publicChannels,
  starredChannelsById,
});

export default rootReducer;
