import { all, call, takeLatest } from "redux-saga/effects";
import {
  getStarredRef,
  getStarredChannelRef
} from "../../../firebase/firebase";

const REQUEST_ADD_TO_STARRED = "saga-messageHeader/requestAddToStarred";
const REQUEST_REMOVE_FROM_STARRED =
  "saga-messageHeader/requestRemoveFromStarred";

const requestAddToStarred = (currentUserId, channel) => ({
  type: REQUEST_ADD_TO_STARRED,
  currentUserId,
  channel
});

const requestRemoveFromStarred = (currentUserId, channel) => ({
  type: REQUEST_REMOVE_FROM_STARRED,
  currentUserId,
  channel
});

function* addToStarred({ currentUserId, channel }) {
  const starredRef = getStarredRef(currentUserId);
  const _channel = {
    [channel.id]: {
      name: channel.name,
      topic: channel.topic
    }
  };

  try {
    yield call([starredRef, starredRef.update], _channel);
  } catch (error) {
    console.error({ addToStarredError: error });
  }
}

function* watchAddToStarred() {
  yield takeLatest(REQUEST_ADD_TO_STARRED, addToStarred);
}

function* removeFromStarred({ currentUserId, channel }) {
  const starredChannelRef = getStarredChannelRef(currentUserId, channel.id);

  try {
    yield call([starredChannelRef, starredChannelRef.remove]);
  } catch (error) {
    console.error({ removeFromStarredError: error });
  }
}

function* watchRemoveFromStarred() {
  yield takeLatest(REQUEST_REMOVE_FROM_STARRED, removeFromStarred);
}

function* toggleStarSaga() {
  yield all([watchAddToStarred(), watchRemoveFromStarred()]);
}

export default toggleStarSaga;

export const sagaActionTypes = {
  REQUEST_ADD_TO_STARRED,
  REQUEST_REMOVE_FROM_STARRED
};

export const sagaActions = {
  requestAddToStarred,
  requestRemoveFromStarred
};
