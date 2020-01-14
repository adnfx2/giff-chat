const LOAD_MESSAGE = "messages/messageLoaded";
const RESET_MESSAGES = "messages/reset";

const loadMessage = (channelId, message) => ({
  type: LOAD_MESSAGE,
  channelId,
  message
});

const resetMessages = () => ({ type: RESET_MESSAGES });

const defaultMessagesState = [];

const messagesReducer = (state = defaultMessagesState, action) => {
  switch (action.type) {
    case LOAD_MESSAGE: {
      const { channelId, message } = action;
      const prevMessages = state[channelId] || [];

      return {
        ...state,
        [channelId]: [...prevMessages, message]
      };
    }
    case RESET_MESSAGES: {
      return defaultMessagesState;
    }
    default:
      return state;
  }
};

export default messagesReducer;

export const actionTypes = {
  LOAD_MESSAGE,
  RESET_MESSAGES
};

export const actions = {
  loadMessage,
  resetMessages
};
