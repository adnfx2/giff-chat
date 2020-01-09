import channelsReducer from "./PublicChannels/reducer";
import starredReducer from "./StarredChannels/reducer";
import usersReducer from "./DirectMessages/reducer";

const CURRENT_CHANNEL_CHANGED = "currentChannel/changed";
const UNREAD_MESSAGES_UPDATED = "unreadMessages/updated";
const UNREAD_MESSAGES_RESET = "unreadMessages/reset";

const currentChannelChanged = channelId => ({
  type: CURRENT_CHANNEL_CHANGED,
  channelId
});

const unreadMessagesUpdated = (channelId, unreadMessagesCount) => ({
  type: UNREAD_MESSAGES_UPDATED,
  channelId,
  unreadMessagesCount
});

const unreadMessagesReset = () => ({
  type: UNREAD_MESSAGES_RESET
});

const currentChannelReducer = (state = "", action) => {
  if (action.type === CURRENT_CHANNEL_CHANGED) {
    return action.channelId;
  }
  return state;
};

const defaultUnreadMessagesState = {
  byChannelId: {}
};

const unreadMessagesReducer = (state = defaultUnreadMessagesState, action) => {
  switch (action.type) {
    case UNREAD_MESSAGES_UPDATED: {
      const { channelId, unreadMessagesCount } = action;

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [channelId]: unreadMessagesCount || 0
        }
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
  UNREAD_MESSAGES_UPDATED,
  UNREAD_MESSAGES_RESET
};

export const actions = {
  currentChannelChanged,
  unreadMessagesUpdated,
  unreadMessagesReset
};
