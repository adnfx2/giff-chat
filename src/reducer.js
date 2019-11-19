/* reducer */
import * as actionTypes from "./actions.js";
import { combineReducers } from "redux";

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
      return { ...state, selectedChannel: action.channel };
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

const rootReducer = combineReducers({
  userData,
  channels,
  messages
});
export default rootReducer;
