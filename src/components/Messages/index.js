import React, { useState } from "react";
import { Grid, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import SearchMessages from "./SearchMessages";
import { useSelector } from "react-redux";
import Message from "./Message";

const styles = {
  stacked: {
    height: "100%",
    flexDirection: "column"
  },
  compact: {
    padding: "0"
  },
  "fill-height-available": {
    flex: "1 1 0",
    overflowY: "scroll"
  }
};

const Messages = () => {
  const [isSearching, setIsSearching] = useState(false);
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const currentChannel = useSelector(state => state.currentChannel);
  const messages = useSelector(state => state.messages[currentChannel.id]);

  return (
    <Grid padded columns={1} style={styles.stacked} fluid="true">
      <Grid.Column style={styles.compact}>
        <MessagesHeader
          currentUser={currentUser}
          currentChannel={currentChannel}
        />
      </Grid.Column>

      <Grid.Column style={styles["fill-height-available"]}>
        <Comment.Group>
          {messages &&
            messages.map(message => (
              <Message
                key={message.timestamp}
                message={message}
                currentUser={currentUser}
              />
            ))}
        </Comment.Group>
      </Grid.Column>

      <Grid.Column style={styles.compact}>
        {!isSearching ? (
          <MessagesForm
            currentUser={currentUser}
            currentChannel={currentChannel}
          />
        ) : (
          <SearchMessages
            isSearching={isSearching}
            handleExit={() => console.log("handleExitSearch")}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Messages;
