import React from "react";
import { useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";

const styles = {
  container: {
    paddingBottom: "2em"
  },
  starredChannels: {
    opacity: 0.7,
    fontStyle: "italic"
  }
};

const renderStarredItems = (channels, starredIds) =>
  starredIds.map(id => {
    if (!channels[id]) {
      return "";
    }

    return (
      <Menu.Item
        key={id}
        onClick={() => console.log("StarredChannelsClicked")}
        style={styles.starredChannels}
        active={false}
      >
        {channels[id].name}
      </Menu.Item>
    );
  });

const StarredChannels = () => {
  const channels = useSelector(({ channels }) => channels.byId);
  const starredIds = useSelector(({ starred }) => starred);
  const totalStarredChannels = starredIds.length;

  return (
    <Menu.Menu style={styles.container}>
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>{" "}
        ({totalStarredChannels})
      </Menu.Item>
      {channels ? renderStarredItems(channels, starredIds) : ""}
    </Menu.Menu>
  );
};

export default StarredChannels;
