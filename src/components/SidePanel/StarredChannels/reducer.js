const CHANNEL_STARRED = "starred/channelStarred";
const CHANNEL_UNSTARRED = "starred/channelUnstarred";
const STARRED_RESET = "starred/reset";

const channelStarred = channelId => ({
  type: CHANNEL_STARRED,
  channelId
});

const channelUnstarred = channelId => ({
  type: CHANNEL_UNSTARRED,
  channelId
});

const starredReset = () => ({
  type: STARRED_RESET
});

const defaultState = [];

const starredReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANNEL_STARRED: {
      return [...state, action.channelId];
    }
    case CHANNEL_UNSTARRED: {
      const filteredResult = state.filter(id => id !== action.channelId);
      return filteredResult;
    }
    case STARRED_RESET:
      return defaultState;
    default:
      return state;
  }
};

export default starredReducer;

export const actionTypes = {
  CHANNEL_STARRED,
  CHANNEL_UNSTARRED,
  STARRED_RESET
};

export const actions = {
  channelStarred,
  channelUnstarred,
  starredReset
};
