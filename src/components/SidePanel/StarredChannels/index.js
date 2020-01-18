import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { actions as sidePanelActions } from "../reducer";

const styles = {
  container: {
    paddingBottom: "2em"
  },
  starredChannels: {
    opacity: 0.7,
    fontStyle: "italic"
  }
};

const renderStarredItems = (channels, starredIds, currentChannelId, handler) =>
  starredIds.map(channelId => {
    const channel = channels[channelId];

    if (channel) {
      return (
        <Menu.Item
          key={channelId}
          onClick={() => handler(channelId)}
          style={styles.starredChannels}
          active={currentChannelId === channelId}
        >
          {channel.name}
        </Menu.Item>
      );
    }
    return "";
  });

const StarredChannels = ({ currentChannel }) => {
  const dispatch = useDispatch();
  const channels = useSelector(({ channels }) => channels.byId);
  const starredIds = useSelector(({ starred }) => starred);
  const totalStarredChannels = starredIds.length;

  const handleChangeChannel = channelId => {
    dispatch(sidePanelActions.currentChannelChanged(channelId));
  };

  return (
    <Menu.Menu style={styles.container}>
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>{" "}
        ({totalStarredChannels})
      </Menu.Item>
      {channels
        ? renderStarredItems(
            channels,
            starredIds,
            currentChannel.id,
            handleChangeChannel
          )
        : ""}
    </Menu.Menu>
  );
};

export default StarredChannels;
