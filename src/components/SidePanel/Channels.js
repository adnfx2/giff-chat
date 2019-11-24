import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import ModalChannel from "../../components/ModalChannel/ModalChannel";
import { loadChannel, setChannel } from "../../actions";
import firebase from "../../firebase/firebase";
import ChannelItem from "./ChannelItem";

const useStyle = createUseStyles({
  channels: {
    paddingBottom: "2em"
  }
});

const useFirebaseDB = reference => {
  return useState(firebase.database().ref(reference));
};

const useLoadChannels = (channelsRef, selectedChannel) => {
  const dispatch = useDispatch();

  useEffect(() => {
    channelsRef.on("child_added", snap => {
      const channel = snap.val();
      dispatch(loadChannel(channel));
    });

    return () => channelsRef.off();
  }, []); //eslint-disable-line
};

const useChannelController = () => {
  const dispatch = useDispatch();
  const { selectedChannel, loadedChannels } = useSelector(
    state => state.channels
  );

  useEffect(() => {
    if (!selectedChannel && loadedChannels.length > 0) {
      dispatch(setChannel(loadedChannels[0]));
    }
  }, [selectedChannel, loadedChannels, dispatch]);

  return {
    selectedChannel,
    loadedChannels,
    setChannel: channel => dispatch(setChannel(channel))
  };
};

const Channels = ({ currentUser }) => {
  const [toggleModalChannel, setToggleModalChannel] = useState(false);
  const [channelsRef] = useFirebaseDB("channels");
  const styles = useStyle();
  const {
    selectedChannel,
    setChannel,
    loadedChannels: channels
  } = useChannelController();
  useLoadChannels(channelsRef, selectedChannel);

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
              <ChannelItem key={channel.id} channel={channel} />
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
