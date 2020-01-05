import { eventChannel } from "redux-saga";
import { cancelled, put, take } from "redux-saga/effects";

const createSagaListener = (name, channel, actions) => {
  const { actionSucceded, actionFailed, actionFinished } = actions;

  return function*() {
    try {
      while (true) {
        const externalData = yield take(channel);
        if (externalData[name]) {
          yield put(actionSucceded(externalData[name]));
        } else {
          console.log(`invalid data recieved from channel: ${name}`);
        }
      }
    } catch (error) {
      yield put(actionFailed(error));
    } finally {
      if (yield cancelled()) {
        channel.close();
        yield put(actionFinished());
      }
    }
  };
};
