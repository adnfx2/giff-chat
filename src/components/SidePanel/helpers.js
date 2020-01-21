import { eventChannel } from "redux-saga";
import { put, select, take } from "redux-saga/effects";
import { actions as sidePanelActions } from "./reducer";
import { getChannelMessagesRef } from "../../firebase/firebase";

// REUSEABLE FUNCTIONS

export const getChannelId = (userId, currentUserId) =>
  userId < currentUserId
    ? `${userId}/${currentUserId}`
    : `${currentUserId}/${userId}`;

// REUSEABLE SAGAS

export function* unreadMessagesListener(channelId, isPrivate) {
  const channelMessagesRef = getChannelMessagesRef(channelId, isPrivate);
  const channel = new eventChannel(emiter => {
    channelMessagesRef.on("value", snapshot => {
      emiter({ totalMessages: snapshot.numChildren() });
    });

    return () => {
      channelMessagesRef.off();
    };
  });

  try {
    let readMessages = null;
    while (true) {
      const { totalMessages } = yield take(channel);

      const currentChannelId = yield select(state => state.currentChannel.id);

      if (currentChannelId !== channelId) {
        readMessages = readMessages === null ? totalMessages : readMessages;

        const unreadMessages = totalMessages - readMessages;

        yield put(
          sidePanelActions.unreadMessagesUpdated(channelId, unreadMessages)
        );
      } else {
        readMessages = totalMessages;
      }
    }
  } catch (error) {
    console.error({ publicNotificationsListener: error });
  } finally {
    channel.close();
    yield put(sidePanelActions.unreadMessagesReset());
  }
}
