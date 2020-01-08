import { eventChannel } from "redux-saga";
import { cancelled, put, select, take } from "redux-saga/effects";
import { getStarredRef } from "../../../firebase/firebase";
import { actions } from "./reducer";

export function* starredChannelsListener() {
  console.log("starredListener/init == STARTED");
  const currentUserId = yield select(({ auth }) => auth.user.userProfile.uid);
  const starredRef = getStarredRef(currentUserId);
  const channel = new eventChannel(emiter => {
    starredRef.on("child_added", snapshot => {
      const channel = snapshot.val();
      if (channel) {
        const channelId = snapshot.key;
        const starredAction = actions.channelStarred(channelId);
        emiter({ starredAction });
      }
    });

    starredRef.on("child_removed", snapshot => {
      const channel = snapshot.val();
      if (channel) {
        const channelId = snapshot.key;
        const starredAction = actions.channelUnstarred(channelId);
        emiter({ starredAction });
      }
    });

    return () => {
      starredRef.off();
      console.log("starredsListener/starredsRef == OFF");
    };
  });

  try {
    while (true) {
      const { starredAction } = yield take(channel);
      yield put(starredAction);
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
      yield put(actions.starredReset());
      console.log("starredsListener/channel == CLOSED");
    }
  }
}
