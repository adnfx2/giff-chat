import React, { useState, useEffect } from "react";
import { Grid, Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import SearchMessages from "./SearchMessages";
import { createUseStyles } from "react-jss";
import firebase from "../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { loadMessage } from "../../actions";
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
        {/*`  <MessagesHeader
          starredChannel={starredChannel}
          setStarredChannel={setStarredChannel}
          channel={channels.selectedChannel}
          isPrivateChannel={channels.privateChannel}
          members={members}
          searchHandler={searchHandler}
          searchLoading={searchLoading}
          currentUser={user}
          handleSearch={handleSearch}
          />`*/}
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
        footed
        {/*`!isSearching ? (
          <MessagesForm
            messagesRef={finalMessagesRef}
            isPrivateChannel={channels.privateChannel}
          />
        ) : (
          <SearchMessages
            isSearching={isSearching}
            handleExitSearch={handleExitSearch}
          />
        )`*/}
      </Grid.Column>
    </Grid>
  );
};

export default Messages;
