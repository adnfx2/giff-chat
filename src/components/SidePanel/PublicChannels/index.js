import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import ModalChannel from "../../ModalChannel/ModalChannel";
import { actions } from "./reducer";
import ChannelItem from "./ChannelItem";

const styles = {
  channels: {
    paddingBottom: "2em"
  }
};

const PublicChannels = () => {
  const [toggleModalChannel, setToggleModalChannel] = useState(false);
  const selectedChannelId = useSelector(state => state.currentChannel);
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const channelsById = useSelector(({ channels }) => channels.byId);
  const channelsIds = useSelector(({ channels }) => channels.allIds);

  return (
    <React.Fragment>
      <Menu.Menu style={styles.channels}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channelsIds.length}){" "}
          <Icon name="add" onClick={() => setToggleModalChannel(true)} />
        </Menu.Item>
        {channelsIds.map(channelId => {
          const channel = channelsById[channelId];

          return (
            <ChannelItem
              key={channelId}
              channelId={channelId}
              channel={channel}
            />
          );
        })}
      </Menu.Menu>
      <ModalChannel
        currentUser={currentUser}
        channelsRef={"channelsRef"}
        visibility={toggleModalChannel}
        onCloseHandler={() => setToggleModalChannel(false)}
      />
    </React.Fragment>
  );
};

export default PublicChannels;
