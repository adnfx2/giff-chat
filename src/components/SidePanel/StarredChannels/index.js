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

const renderStarredItems = (channels, starredIds, selectedChannelId, handler) =>
  starredIds.map(id => {
    const channel = channels[id];

    if (!channel) {
      return "";
    }

    return (
      <Menu.Item
        key={id}
        onClick={() => handler(id)}
        style={styles.starredChannels}
        active={selectedChannelId === id}
      >
        {channels[id].name}
      </Menu.Item>
    );
  });

const StarredChannels = () => {
  const dispatch = useDispatch();
  const selectedChannelId = useSelector(state => state.currentChannel);
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
            selectedChannelId,
            handleChangeChannel
          )
        : ""}
    </Menu.Menu>
  );
};

export default StarredChannels;
