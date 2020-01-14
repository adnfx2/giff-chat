import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Transition, Header, Segment, Input, Icon } from "semantic-ui-react";
import { sagaActions } from "./sagas";

const styles = {
  container: {
    padding: 0
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 0
  },
  headerItem: {
    padding: "1em"
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "1em",
    fontSize: "0.9em"
  }
};

const displayName = (channel, isPrivate) => {
  if (!channel) {
    return "NoChannel";
  }
  return `${isPrivate ? "@" : "#"}${channel.name}`;
};

const MessagesHeader = ({
  currentChannel,
  starredChannel,
  setStarredChannel,
  members,
  searchHandler,
  searchLoading,
  isPrivateChannel,
  currentUser,
  handleSearch
}) => {
  const dispatch = useDispatch();
  const { id: channelId, isPrivate } = currentChannel;
  const channel = useSelector(state => state.channels.byId[channelId]);
  const isStarred = useSelector(state => state.starred.indexOf(channelId) > -1);

  const toggleStarHandler = () => {
    const finalAction = !isStarred
      ? sagaActions.requestAddToStarred
      : sagaActions.requestRemoveFromStarred;

    dispatch(finalAction(currentUser.uid, channel));
  };

  return (
    <Segment fluid="true" style={styles.container}>
      <Header fluid="true" as="h3" style={styles.header}>
        <span style={styles.headerItem}>
          {displayName(channel, isPrivate)}{" "}
          {!isPrivate && channel && (
            <Icon
              onClick={toggleStarHandler}
              name={`${isStarred ? "star" : "star outline"}`}
              color={`${isStarred ? "yellow" : "black"}`}
            />
          )}
        </span>
        <Icon onClick={handleSearch} name="search" style={styles.icon} />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
