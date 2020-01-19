import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Segment, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import { sagaActions } from "./sagas";

const useSearchAnimation = createUseStyles({
  "@keyframes beatbeat": {
    from: {
      transform: "scale(1)"
    },
    to: {
      transform: "scale(1.44)"
    }
  },
  beatbeat: {
    animation: "1s ease-in-out infinite alternate $beatbeat"
  }
});

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
  currentUser,
  currentChannel,
  showSearch,
  handleSearch
}) => {
  const dispatch = useDispatch();
  const { id: channelId, isPrivate } = currentChannel;
  const channel = useSelector(state => state.channels.byId[channelId]);
  const isStarred = useSelector(state => state.starred.indexOf(channelId) > -1);
  const classes = useSearchAnimation();

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
        <Icon
          onClick={handleSearch}
          name="search"
          className={showSearch ? classes.beatbeat : ""}
          color={showSearch ? "blue" : "black"}
          style={styles.icon}
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
