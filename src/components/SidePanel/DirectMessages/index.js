import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon, Label } from "semantic-ui-react";
import { actions as sidePanelActions } from "../reducer";
import { getChannelId } from "../helpers";

const styles = {
  dm: {
    paddingBottom: "2em"
  },
  dm__item: {
    opacity: 0.7,
    fontStyle: "italic"
  }
};

const renderNotifications = count => {
  if (count) {
    return <Label color="red">{count}</Label>;
  }
};

const DirectMessages = ({ currentUser, currentChannel }) => {
  const dispatch = useDispatch();
  const usersById = useSelector(({ users }) => users.byId);
  const usersIds = useSelector(({ users }) => users.allIds);
  const presence = useSelector(({ users }) => users.presence);
  const unreadMessages = useSelector(state => state.unreadMessages);

  const handleChangeChannel = channelId => {
    dispatch(sidePanelActions.currentChannelChanged(channelId, true));
    dispatch(sidePanelActions.unreadMessagesUpdated(channelId, 0));
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
        const unreadMessagesCount = unreadMessages[directChannelId];

        return (
          <Menu.Item
            key={directChannelId}
            onClick={() => handleChangeChannel(directChannelId)}
            style={styles.dm__item}
            active={currentChannel.id === directChannelId}
          >
            <span>
              <Icon name="circle" color={isOnline ? "green" : "red"} />{" "}
              {user.name}
            </span>
            {renderNotifications(unreadMessagesCount)}
          </Menu.Item>
        );
      })}
    </Menu.Menu>
  );
};

export default DirectMessages;
