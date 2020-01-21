import { eventChannel } from "redux-saga";
import { fork, put, take } from "redux-saga/effects";
import { actions, actionTypes } from "./reducer";
import { actions as messagesActions } from "../Messages/reducer";
import { getChannelMessagesRef } from "../../firebase/firebase";
import { publicChannelsListener } from "./PublicChannels/sagas";
import { starredChannelsListener } from "./StarredChannels/sagas";
import {
  connectedListener,
  usersListener,
  usersPresenceListener
} from "./DirectMessages/sagas";

function* messagesListener(channelId, isPrivate) {
  const messagesRef = getChannelMessagesRef(channelId, isPrivate);
  const channel = new eventChannel(emiter => {
    messagesRef.on("child_added", snapshot => {
      const message = snapshot.val();
      setTimeout(() => emiter({ message }), 0); // weird redux-saga bug fixed, emiting event before take(channel) being set
    });

    return () => messagesRef.off();
  });

  try {
    while (true) {
      const { message } = yield take(channel);
      yield put(messagesActions.loadMessage(channelId, message));
    }
  } catch (error) {
    console.error({ messagesListenerError: error });
  } finally {
    channel.close();
    yield put(messagesActions.resetMessages());
  }
}

function* currentChannelListener() {
  const channelsVisited = [];

  try {
    while (true) {
      const { channelId, isPrivate } = yield take(
        actionTypes.CURRENT_CHANNEL_CHANGED
      );
      const isChannelVisited = channelsVisited.indexOf(channelId) > -1;

      // Start messagesListener only on unvisited channels

      if (!isChannelVisited) {
        channelsVisited.push(channelId);
        yield fork(messagesListener, channelId, isPrivate);
      }
    }
  } catch (error) {
    console.error({ currentChannelListener: error });
  } finally {
    yield put(actions.currentChannelReset());
  }
}

export const sidePanelListeners = [
  publicChannelsListener,
  starredChannelsListener,
  connectedListener,
  usersListener,
  usersPresenceListener,
  currentChannelListener
];
