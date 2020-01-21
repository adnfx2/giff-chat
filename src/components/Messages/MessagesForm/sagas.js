import { eventChannel } from "redux-saga";
import { all, call, cancelled, put, take, takeEvery } from "redux-saga/effects";
import uuidv4 from "uuid/v4";
import firebase, {
  getStoragePathRef,
  getUniqueMessageRef
} from "../../../firebase/firebase";
import { actions } from "./reducer";

const SEND_TEXT_MESSAGE_REQUEST = "saga-messagesForm/sendTextMessageRequest";
const SEND_FILE_MESSAGE_REQUEST = "saga-messagesForm/sendFileMessageRequest";

const sendTextMessageRequest = (currentUser, currentChannel, message) => ({
  type: SEND_TEXT_MESSAGE_REQUEST,
  currentUser,
  currentChannel,
  message
});

const sendFileMessageRequest = payload => ({
  type: SEND_FILE_MESSAGE_REQUEST,
  payload
});

const createMessage = (currentUser, message, fileUrl = null) => {
  const msgType = fileUrl !== null ? { image: fileUrl } : { content: message };
  return {
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    user: {
      id: currentUser.uid,
      name: currentUser.displayName,
      avatar: currentUser.photoURL
    },
    ...msgType
  };
};

function* sendTextMessage({ currentUser, currentChannel, message }) {
  const { id: channelId, isPrivate } = currentChannel;

  try {
    const uniqueMessageRef = getUniqueMessageRef(channelId, isPrivate);

    yield put(actions.sendingTextMessage(channelId));

    const createdMessage = createMessage(currentUser, message);

    yield call([uniqueMessageRef, uniqueMessageRef.set], createdMessage);

    yield put(actions.textMessageSuccess(channelId));
  } catch (error) {
    console.error({ sendMessageError: error });
    yield put(actions.textMessageFail(channelId, error));
  }
}

function* watchSendTextMessage() {
  yield takeEvery(SEND_TEXT_MESSAGE_REQUEST, sendTextMessage);
}

function* percentUploadedListener(currentChannelId, uploadTask) {
  const channel = new eventChannel(emiter => {
    const handleUploadProgress = snapshot => {
      const percentUploaded = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      emiter({ percentUploaded });
    };

    const handleError = error => {
      throw new Error(error);
    };

    const handleUploadCompleted = () => {
      emiter({ isCompleted: true });
    };

    const unsubscribe = uploadTask.on(
      "state_changed",
      handleUploadProgress,
      handleError,
      handleUploadCompleted
    );

    return () => unsubscribe();
  });

  try {
    while (true) {
      const { percentUploaded, isCompleted } = yield take(channel);
      if (isCompleted) {
        break;
      } else {
        yield put(
          actions.updatePercentUploaded(currentChannelId, percentUploaded)
        );
      }
    }

    const completedTaskRef = uploadTask.snapshot.ref;

    const { getDownloadURL } = completedTaskRef;

    const fileUrl = yield call([completedTaskRef, getDownloadURL]);

    return yield { fileUrl };
  } finally {
    channel.close();
  }
}

function* uploadFile(payload) {
  const { currentChannelId, file, metadata, isPrivateChannel } = payload;
  const firebasePath = isPrivateChannel ? "chat/private" : "chat/public";
  const filePath = `${firebasePath}/${uuidv4()}.jpg`;
  const storagePathRef = getStoragePathRef(filePath);

  yield put(actions.uploadingFile(currentChannelId));

  const uploadTask = storagePathRef.put(file, metadata);

  const uploadCompleted = yield call(
    percentUploadedListener,
    currentChannelId,
    uploadTask
  );

  yield put(actions.uploadCompleted(currentChannelId));

  return uploadCompleted;
}

function* sendFileMessage(currentUser, currentChannelId, fileUrl) {
  try {
    const uniqueMessageRef = getUniqueMessageRef(currentChannelId);
    yield put(actions.sendingFileMessage(currentChannelId));

    const createdFileMessage = createMessage(currentUser, null, fileUrl);

    yield call([uniqueMessageRef, uniqueMessageRef.set], createdFileMessage);

    yield put(actions.fileMessageSuccess(currentChannelId));
  } catch (error) {
    console.error({ sendFileMessageError: error });
    yield put(actions.fileMessageFail(currentChannelId, error));
  }
}

function* sendFileFlow({ payload }) {
  const { currentUser, currentChannelId } = payload;
  try {
    const uploadCompleted = yield call(uploadFile, payload);

    yield call(
      sendFileMessage,
      currentUser,
      currentChannelId,
      uploadCompleted.fileUrl
    );
  } catch (error) {
    console.error({ sendFileFlowError: error });
    yield put(actions.uploadFail(error));
  } finally {
    if (yield cancelled()) {
      yield put(actions.uploadFileReset());
    }
  }
}

function* watchSendFileMessage() {
  yield takeEvery(SEND_FILE_MESSAGE_REQUEST, sendFileFlow);
}

function* messagesFormSaga() {
  try {
    yield all([watchSendTextMessage(), watchSendFileMessage()]);
  } catch (error) {
    console.error({ messagesFormSagaError: error });
  } finally {
    yield put(actions.resetMessagesForm);
  }
}

export default messagesFormSaga;

export const sagaActionTypes = {
  SEND_TEXT_MESSAGE_REQUEST,
  SEND_FILE_MESSAGE_REQUEST
};

export const sagaActions = {
  sendTextMessageRequest,
  sendFileMessageRequest
};
