const ADDED_TO_STARREDS = "starreds/addedStarred";
const REMOVED_FROM_STARREDS = "starreds/removedStarred";
const STARRED_CHANNELS_REMOVED = "starreds/starredChannelsRemoved";

const addedToStarreds = starredChannel => ({
  type: ADDED_TO_STARREDS,
  starredChannel
});

const removedFromStarreds = unstarredChannelId => ({
  type: REMOVED_FROM_STARREDS,
  unstarredChannelId
});

const starredChannelsRemoved = () => ({
  type: STARRED_CHANNELS_REMOVED
});

const removeKey = (key, obj) => {
  const _obj = { ...obj };
  delete obj[key];
  return _obj;
};

const defaultStarredsState = {};

const starredsReducer = (state = defaultStarredsState, action) => {
  switch (action.type) {
    case ADDED_TO_STARREDS: {
      const { channelId, channelInfo } = action.starredChannel;
      return {
        ...state,
        [channelId]: channelInfo
      };
    }
    case REMOVED_FROM_STARREDS: {
      const { channelId } = action.unstarredChannelId;
      const finalStarreds = removeKey(channelId, state.starredChannelsById);
      return { finalStarreds };
    }
    case STARRED_CHANNELS_REMOVED:
      return defaultStarredsState;
    default:
      return state;
  }
};

export default starredsReducer;

export const actionTypes = {
  ADDED_TO_STARREDS,
  REMOVED_FROM_STARREDS,
  STARRED_CHANNELS_REMOVED
};

export const actions = {
  addedToStarreds,
  removedFromStarreds,
  starredChannelsRemoved
};
