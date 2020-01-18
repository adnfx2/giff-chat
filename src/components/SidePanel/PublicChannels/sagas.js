import { eventChannel } from "redux-saga";
import { fork, put, select, take } from "redux-saga/effects";
import {
  firebaseRefs,
  getChannelMessagesRef
} from "../../../firebase/firebase";
import { actions } from "./reducer";
import { actions as sidePanelActions } from "../reducer";

export function* publicChannelsListener() {
  console.log("publicChannelsListener/init == STARTED");
  const channel = new eventChannel(emiter => {
    firebaseRefs.channels.on("child_added", snapshot =>
      emiter({ publicChannel: snapshot.val() })
    );

    return () => {
      firebaseRefs.channels.off();
      console.log("publicChannelsListener/firebaseRefs.channels == OFF");
    };
  });

  try {
    while (true) {
      const { publicChannel } = yield take(channel);
      if (publicChannel) {
        yield put(actions.channelAdded(publicChannel));
        yield fork(unreadMessagesListener, publicChannel.id);
      }
    }
  } catch (error) {
    console.error({ publicChannelsError: error });
  } finally {
    channel.close();
    yield put(actions.publicChannelsReset());
    console.log("publicChannelsListener/channel == CLOSED");
  }
}

export function* unreadMessagesListener(channelId) {
  console.log("unreadMessagesListener/init == STARTED");
  const channelMessagesRef = getChannelMessagesRef(channelId);
  const channel = new eventChannel(emiter => {
    channelMessagesRef.on("value", snapshot => {
      emiter({ totalMessages: snapshot.numChildren() });
    });

    return () => {
      channelMessagesRef.off();
      console.log("unreadMessagesListener/channelMessagesRef == OFF");
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
    console.log("unreadMessagesListener/channel == CLOSED");
  }
}
