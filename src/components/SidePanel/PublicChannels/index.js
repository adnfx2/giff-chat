import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon, Label } from "semantic-ui-react";
import ModalChannel from "./ModalChannel";
import { actions as sidePanelActions } from "../reducer";

const styles = {
  channels: {
    paddingBottom: "2em"
  }
};

const renderNotifications = count => {
  if (count) {
    return <Label color="red">{count}</Label>;
  }
};

const PublicChannels = ({ currentUser, currentChannel }) => {
  const [toggleModalChannel, setToggleModalChannel] = useState(false);
  const dispatch = useDispatch();
  const channelsById = useSelector(({ channels }) => channels.byId);
  const channelsIds = useSelector(({ channels }) => channels.allIds);
  const unreadMessages = useSelector(state => state.unreadMessages);

  const handleChangeChannel = channelId => {
    dispatch(sidePanelActions.currentChannelChanged(channelId));
    dispatch(sidePanelActions.unreadMessagesUpdated(channelId, 0));
  };

  if (channelsIds.length > 0 && !currentChannel.id) {
    dispatch(sidePanelActions.currentChannelChanged(channelsIds[0]));
  }

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
          const unreadMessagesCount = unreadMessages[channelId];

          return (
            <Menu.Item
              key={channelId}
              onClick={() => handleChangeChannel(channelId)}
              name={channel.name}
              active={currentChannel.id === channelId}
            >
              {renderNotifications(unreadMessagesCount)}# {channel.name}
            </Menu.Item>
          );
        })}
      </Menu.Menu>
      <ModalChannel
        currentUser={currentUser}
        visibility={toggleModalChannel}
        onCloseHandler={() => setToggleModalChannel(false)}
      />
    </React.Fragment>
  );
};

export default PublicChannels;
