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
      return { ...state, selectedChannel: action.channelId };
    default:
      return state;
  }
};

const initialMessagesState = {
  loadedMessages: {}
};

const messages = (state = initialMessagesState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_MESSAGE:
      const { loadedMessages } = state;
      const { channelId, incommingMessage } = action;

      return {
        ...state,
        loadedMessages: {
          ...loadedMessages,
          [channelId]: incommingMessage
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
