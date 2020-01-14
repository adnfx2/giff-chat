import channelsReducer from "./PublicChannels/reducer";
import starredReducer from "./StarredChannels/reducer";
import usersReducer from "./DirectMessages/reducer";

const CURRENT_CHANNEL_CHANGED = "currentChannel/changed";
const CURRENT_CHANNEL_RESET = "currentChannel/reset";
const UNREAD_MESSAGES_UPDATED = "unreadMessages/updated";
const UNREAD_MESSAGES_RESET = "unreadMessages/reset";

const currentChannelChanged = (channelId, isPrivate = false) => ({
  type: CURRENT_CHANNEL_CHANGED,
  channelId,
  isPrivate
});

const currentChannelReset = () => ({
  type: CURRENT_CHANNEL_RESET
});

const unreadMessagesUpdated = (channelId, unreadMessagesCount) => ({
  type: UNREAD_MESSAGES_UPDATED,
  channelId,
  unreadMessagesCount
});

const unreadMessagesReset = () => ({
  type: UNREAD_MESSAGES_RESET
});

const defaultCurrentChannelState = {
  id: "",
  isPrivate: false
};

const currentChannelReducer = (state = defaultCurrentChannelState, action) => {
  switch (action.type) {
    case CURRENT_CHANNEL_CHANGED: {
      return {
        id: action.channelId,
        isPrivate: action.isPrivate
      };
    }
    case CURRENT_CHANNEL_RESET: {
      return defaultCurrentChannelState;
    }
    default:
      return state;
  }
};

const defaultUnreadMessagesState = {};

const unreadMessagesReducer = (state = defaultUnreadMessagesState, action) => {
  switch (action.type) {
    case UNREAD_MESSAGES_UPDATED: {
      const { channelId, unreadMessagesCount } = action;

      return {
        ...state,
        [channelId]: unreadMessagesCount || 0
      };
    }
    case UNREAD_MESSAGES_RESET: {
      return defaultUnreadMessagesState;
    }
    default:
      return state;
  }
};

export default {
  currentChannel: currentChannelReducer,
  channels: channelsReducer,
  starred: starredReducer,
  users: usersReducer,
  unreadMessages: unreadMessagesReducer
};

export const actionTypes = {
  CURRENT_CHANNEL_CHANGED,
  CURRENT_CHANNEL_RESET,
  UNREAD_MESSAGES_UPDATED,
  UNREAD_MESSAGES_RESET
};

export const actions = {
  currentChannelChanged,
  currentChannelReset,
  unreadMessagesUpdated,
  unreadMessagesReset
};
