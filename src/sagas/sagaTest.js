import { eventChannel } from "redux-saga";
import { cancelled, take } from "redux-saga/effects";
import { firebaseRefs } from "../firebase/firebase";

export default function* listenerUsers() {
  console.log("listenersUsers started");

  const usersChannel = new eventChannel(emiter => {
    firebaseRefs.users.on("child_added", snapshot =>
      emiter({ user: snapshot })
    );
    return () => {
      console.log("firebaserRefs.users.off", firebaseRefs.users.off);
      firebaseRefs.users.off();
    };
  });

  try {
    while (true) {
      const { user } = yield take(usersChannel);
      console.log(user.val());
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (yield cancelled()) {
      console.log("listener cancelled");
      console.log("closing userChannel");
      usersChannel.close();
    }
  }
}
