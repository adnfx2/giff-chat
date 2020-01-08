import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { actions } from "../reducer";

const styles = {
  dm: {
    paddingBottom: "2em"
  },
  dm__item: {
    opacity: 0.7,
    fontStyle: "italic"
  }
};

const DirectMessages = () => {
  const dispatch = useDispatch();
  const selectedChannelId = useSelector(state => state.currentChannel);
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const usersById = useSelector(({ users }) => users.byId);
  const usersIds = useSelector(({ users }) => users.allIds);
  const presence = useSelector(({ users }) => users.presence);

  const handleChangeChannel = channelId => {
    dispatch(actions.currentChannelChanged(channelId));
  };

  return (
    <Menu.Menu style={styles.dm}>
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({usersIds.length})
      </Menu.Item>
      {usersIds.map(userId => {
        const user = usersById[userId];
        const isOnline = presence[userId];
        const directChannelId = getChannelId(userId, currentUser.uid);

        return (
          <Menu.Item
            key={directChannelId}
            onClick={() => handleChangeChannel(directChannelId)}
            style={styles.dm__item}
            active={selectedChannelId === directChannelId}
          >
            <Icon name="circle" color={isOnline ? "green" : "red"} />@{" "}
            {user.name}
          </Menu.Item>
        );
      })}
    </Menu.Menu>
  );
};

const getChannelId = (userId, currentUserId) =>
  userId < currentUserId
    ? `${userId}/${currentUserId}`
    : `${currentUserId}/${userId}`;

export default DirectMessages;
