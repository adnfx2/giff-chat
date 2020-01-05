import { eventChannel } from "redux-saga";
import { cancelled, put, select, take } from "redux-saga/effects";
import { getStarredsRef } from "../../../firebase/firebase";
import { actions } from "./reducer";

export function* starredsListener() {
  console.log("starredsListener/init == STARTED");
  const currentUserId = yield select(({ auth }) => auth.user.userProfile.uid);
  const starredsRef = getStarredsRef(currentUserId);
  const channel = new eventChannel(emiter => {
    starredsRef.on("child_added", snapshot => {
      const channelId = snapshot.key;
      const channelInfo = snapshot.val();
      const starredsAction = actions.addedToStarreds(channelId, channelInfo);

      channelId && emiter({ starredsAction });
    });

    starredsRef.on("child_removed", snapshot => {
      const channelId = snapshot.key;
      const starredsAction = actions.removedFromStarreds(channelId);
      channelId && emiter({ starredsAction });
    });

    return () => {
      starredsRef.off("child_added");
      console.log("starredsListener/starredsRef == OFF");
    };
  });

  try {
    while (true) {
      const { starredsAction } = yield take(channel);
      yield put(starredsAction);
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
      yield put(actions.starredChannelsRemoved());
      console.log("starredsListener/channel == CLOSED");
    }
  }
}
