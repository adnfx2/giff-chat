import { combineReducers } from "redux";

// CONSTANTS

const TYPING_TEXT_MESSAGE = "messagesForm/typingTextMessage";
const SENDING_TEXT_MESSAGE = "messagesForm/sendingTextMessage";
const TEXT_MESSAGE_SUCCESS = "messagesForm/textMessageSent";
const TEXT_MESSAGE_FAIL = "messagesForm/textMessageFailed";
const UPLOADING_FILE = "messagesForm/uploadingFile";
const UPDATE_PERCENT_UPLOADED = "messagesForm/percentUploadedUpdated";
const UPLOAD_COMPLETED = "messagesForm/uploadCompleted";
const UPLOAD_FAIL = "messagesForm/uploadFailed";
const SENDING_FILE_MESSAGE = "messagesForm/sendingFile";
const FILE_MESSAGE_SUCCESS = "messagesForm/fileSent";
const FILE_MESSAGE_FAIL = "messagesForm/fileMessageFailed";
const RESET_MESSAGES_FORM = "messagesForm/reset";

// ACTION CREATORS

const typingTextMessage = (channelId, message) => ({
  type: TYPING_TEXT_MESSAGE,
  channelId,
  message
});

const sendingTextMessage = channelId => ({
  type: SENDING_TEXT_MESSAGE,
  channelId
});

const textMessageSuccess = channelId => ({
  type: TEXT_MESSAGE_SUCCESS,
  channelId
});

const textMessageFail = (channelId, error) => ({
  type: TEXT_MESSAGE_FAIL,
  error
});

const uploadingFile = channelId => ({
  type: UPLOADING_FILE,
  channelId
});

const updatePercentUploaded = (channelId, percentUploaded) => ({
  type: UPDATE_PERCENT_UPLOADED,
  channelId,
  percentUploaded
});

const uploadCompleted = (channelId, error) => ({
  type: UPLOAD_COMPLETED,
  channelId,
  error
});

const uploadFail = (channelId, error) => ({
  type: UPLOAD_FAIL,
  channelId,
  error
});

const sendingFileMessage = channelId => ({
  type: SENDING_FILE_MESSAGE,
  channelId
});

const fileMessageSuccess = channelId => ({
  type: FILE_MESSAGE_SUCCESS,
  channelId
});

const fileMessageFail = (channelId, error) => ({
  type: FILE_MESSAGE_FAIL,
  channelId,
  error
});

const resetMessagesForm = () => ({
  type: RESET_MESSAGES_FORM
});

// DEFAULT STATES

const defaultSendState = {};

export const defaultTextStatus = {
  isSendingTextMessage: false,
  message: "",
  error: ""
};

export const defaultFileStatus = {
  isUploading: false,
  isSendingFileMessage: false,
  error: "",
  percentUploaded: 0
};

// REDUCERS

const textMessageReducer = (state = defaultSendState, action) => {
  const { channelId } = action;
  const prevTextStatus = state[channelId];

  switch (action.type) {
    case TYPING_TEXT_MESSAGE: {
      return {
        ...state,
        [channelId]: {
          ...prevTextStatus,
          message: action.message
        }
      };
    }
    case SENDING_TEXT_MESSAGE: {
      return {
        ...state,
        [channelId]: {
          ...prevTextStatus,
          isSendingTextMessage: true,
          error: ""
        }
      };
    }
    case TEXT_MESSAGE_FAIL: {
      return {
        ...state,
        [channelId]: {
          ...prevTextStatus,
          isSendingTextMessage: false,
          error: action.error
        }
      };
    }
    case TEXT_MESSAGE_SUCCESS: {
      return {
        ...state,
        [channelId]: defaultTextStatus
      };
    }
    case RESET_MESSAGES_FORM: {
      return defaultSendState;
    }
    default:
      return state;
  }
};

const fileMessageReducer = (state = defaultSendState, action) => {
  const { channelId } = action;
  const prevFileStatus = state[channelId];
  switch (action.type) {
    case UPLOADING_FILE: {
      return {
        ...state,
        [channelId]: {
          ...defaultFileStatus,
          isUploading: true
        }
      };
    }
    case UPDATE_PERCENT_UPLOADED: {
      return {
        ...state,
        [channelId]: {
          ...prevFileStatus,
          percentUploaded: action.percentUploaded
        }
      };
    }
    case UPLOAD_FAIL: {
      return {
        ...state,
        [channelId]: {
          ...prevFileStatus,
          isUploading: false,
          error: action.error
        }
      };
    }
    case SENDING_FILE_MESSAGE: {
      return {
        ...state,
        [channelId]: {
          ...prevFileStatus,
          isSendingFileMessage: true,
          error: ""
        }
      };
    }
    case FILE_MESSAGE_FAIL: {
      return {
        ...state,
        [channelId]: {
          ...prevFileStatus,
          isSendingFileMessage: false,
          error: action.error
        }
      };
    }
    case FILE_MESSAGE_SUCCESS:
    case UPLOAD_COMPLETED: {
      return {
        ...state,
        [channelId]: defaultFileStatus
      };
    }
    case RESET_MESSAGES_FORM: {
      return defaultSendState;
    }
    default:
      return state;
  }
};

export default combineReducers({
  textDrafts: textMessageReducer,
  fileDrafts: fileMessageReducer
});

export const actionTypes = {
  TYPING_TEXT_MESSAGE,
  SENDING_TEXT_MESSAGE,
  TEXT_MESSAGE_SUCCESS,
  TEXT_MESSAGE_FAIL,
  UPLOADING_FILE,
  UPDATE_PERCENT_UPLOADED,
  UPLOAD_COMPLETED,
  UPLOAD_FAIL,
  SENDING_FILE_MESSAGE,
  FILE_MESSAGE_SUCCESS,
  FILE_MESSAGE_FAIL,
  RESET_MESSAGES_FORM
};

export const actions = {
  typingTextMessage,
  sendingTextMessage,
  textMessageSuccess,
  textMessageFail,
  uploadingFile,
  updatePercentUploaded,
  uploadFail,
  uploadCompleted,
  sendingFileMessage,
  fileMessageSuccess,
  fileMessageFail,
  resetMessagesForm
};
