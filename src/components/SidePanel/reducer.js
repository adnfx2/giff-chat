import channelsReducer from "./PublicChannels/reducer";
import starredReducer from "./StarredChannels/reducer";
import usersReducer from "./DirectMessages/reducer";

const CURRENT_CHANNEL_CHANGED = "currentChannel/changed";

const currentChannelChanged = channelId => ({
  type: CURRENT_CHANNEL_CHANGED,
  channelId
});

const defaultState = "";

const currentChannelReducer = (state = defaultState, action) => {
  if (action.type === CURRENT_CHANNEL_CHANGED) {
    return action.channelId;
  }
  return state;
};

export default {
  currentChannel: currentChannelReducer,
  channels: channelsReducer,
  starred: starredReducer,
  users: usersReducer
};

export const actionTypes = {
  CURRENT_CHANNEL_CHANGED
};

export const actions = {
  currentChannelChanged
};
