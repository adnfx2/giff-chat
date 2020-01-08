const CHANNEL_ADDED = "publicChannels/channelAdded";
const CHANNEL_REMOVED = "publicChannels/channelRemoved";
const PUBLIC_CHANNELS_RESET = "publicChannels/reset";

const channelAdded = channel => ({
  type: CHANNEL_ADDED,
  channel
});

const publicChannelsReset = () => ({
  type: PUBLIC_CHANNELS_RESET
});

const removeKey = (key, obj) => {
  const _obj = { ...obj };
  delete obj[key];
  return _obj;
};

const defaultState = {
  byId: {},
  allIds: []
};

const publicChannelsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANNEL_ADDED: {
      const { channel } = action;

      return {
        byId: { ...state.byId, [channel.id]: channel },
        allIds: [...state.allIds, channel.id]
      };
    }
    case CHANNEL_REMOVED: {
      const { channelId } = action;
      const _ById = removeKey(channelId, state.byId);
      const _Ids = state.ids.filter(id => id !== channelId);
      return { byId: _ById, allIds: _Ids };
    }
    case PUBLIC_CHANNELS_RESET:
      return defaultState;
    default:
      return state;
  }
};

export default publicChannelsReducer;

export const actionTypes = {
  CHANNEL_ADDED,
  CHANNEL_REMOVED,
  PUBLIC_CHANNELS_RESET
};

export const actions = {
  channelAdded,
  publicChannelsReset
};
