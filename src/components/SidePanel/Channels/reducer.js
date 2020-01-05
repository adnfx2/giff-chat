const PUBLIC_CHANNEL_ADDED = "channels/publicChannelAdded";
const PUBLIC_CHANNELS_REMOVED = "channels/publicChannelsRemoved";

const publicChannelAdded = channel => ({
  type: PUBLIC_CHANNEL_ADDED,
  channel
});

const publicChannelsRemoved = () => ({
  type: PUBLIC_CHANNELS_REMOVED
});

const publicChannelsReducer = (state = [], action) => {
  switch (action.type) {
    case PUBLIC_CHANNEL_ADDED:
      return [...state, action.channel];
    case PUBLIC_CHANNELS_REMOVED:
      return [];
    default:
      return state;
  }
};

export default publicChannelsReducer;

export const actionTypes = {
  PUBLIC_CHANNEL_ADDED,
  PUBLIC_CHANNELS_REMOVED
};

export const actions = {
  publicChannelAdded,
  publicChannelsRemoved
};
