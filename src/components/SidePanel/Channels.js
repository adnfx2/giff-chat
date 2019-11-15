import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import ModalChannel from "../../components/ModalChannel/ModalChannel";
import { loadChannel, setChannel } from "../../actions";
import firebase from "../../firebase/firebase";

const useStyle = createUseStyles({
  channels: {
    paddingBottom: "2em"
  }
});

const useFirebaseDB = reference => {
  return useState(firebase.database().ref("channels"));
};

const useLoadChannels = channelsRef => {
  const dispatch = useDispatch();

  useEffect(() => {
    channelsRef.on("child_added", snap => {
      const channel = snap.val();
      console.log(channel);
      dispatch(loadChannel(channel));
    });

    return () => channelsRef.off();
  }, []); //eslint-disable-line
};

const useCreateSetChannel = () => {
  const dispatch = useDispatch();
  return channelId => dispatch(setChannel(channelId));
};

const useSelectChannel = () => {
  const { selectedChannel, loadedChannels } = useSelector(
    state => state.channels
  );

  let selection;

  if (selectedChannel) {
    selection = selectedChannel;
  } else if (loadedChannels.length > 0) {
    selection = loadedChannels[0].id;
  }

  return [selection, loadedChannels];
};

const Channels = ({ currentUser }) => {
  const [toggleModalChannel, setToggleModalChannel] = useState(false);
  const [channelsRef] = useFirebaseDB("channels");
  const [selectedChannel, channels] = useSelectChannel();
  const styles = useStyle();
  const setChannel = useCreateSetChannel();
  useLoadChannels(channelsRef);

  return (
    <React.Fragment>
      <Menu.Menu className={styles.channels}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}){" "}
          <Icon name="add" onClick={() => setToggleModalChannel(true)} />
        </Menu.Item>
        {channels.length > 0
          ? channels.map(channel => (
              <Menu.Item
                key={channel.id}
                onClick={() => setChannel(channel.id)}
                name={channel.name}
                active={selectedChannel === channel.id}
              >
                # {channel.name}
              </Menu.Item>
            ))
          : ""}
      </Menu.Menu>
      <ModalChannel
        currentUser={currentUser}
        channelsRef={channelsRef}
        visibility={toggleModalChannel}
        onCloseHandler={() => setToggleModalChannel(false)}
      />
    </React.Fragment>
  );
};

export default Channels;
