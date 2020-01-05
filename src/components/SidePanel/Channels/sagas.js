import { eventChannel } from "redux-saga";
import { cancelled, put, take } from "redux-saga/effects";
import { firebaseRefs } from "../../../firebase/firebase";
import { actions } from "./reducer";

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
        yield put(actions.publicChannelAdded(publicChannel));
      }
    }
  } catch (error) {
    console.error({ publicChannelsError: error });
  } finally {
    if (yield cancelled()) {
      channel.close();
      yield put(actions.publicChannelsRemoved());
      console.log("publicChannelsListener/channel == CLOSED");
    }
  }
}
