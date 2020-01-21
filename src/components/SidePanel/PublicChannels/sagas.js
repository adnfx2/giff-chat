import { eventChannel } from "redux-saga";
import { fork, put, take } from "redux-saga/effects";
import { firebaseRefs } from "../../../firebase/firebase";
import { actions } from "./reducer";
import { unreadMessagesListener } from "../helpers";

export function* publicChannelsListener() {
  const channel = new eventChannel(emiter => {
    firebaseRefs.channels.on("child_added", snapshot =>
      emiter({ publicChannel: snapshot.val() })
    );

    return () => {
      firebaseRefs.channels.off();
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
  }
}
