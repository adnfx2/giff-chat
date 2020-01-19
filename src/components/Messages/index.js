import React, { useState } from "react";
import { Grid, Comment } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { useScrollToView, useSearchMessages } from "./hooks";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import SearchMessages from "./SearchMessages";
import Message from "./Message";

const styles = {
  stacked: {
    width: "100%",
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const currentChannel = useSelector(state => state.currentChannel);
  const allMessages = useSelector(state => state.messages[currentChannel.id]);
  const searchStatus = useSearchMessages(allMessages, searchValue);
  const [isSearching, searchResult] = searchStatus;
  const messages = searchResult || allMessages || [];
  const bottomRef = useScrollToView(messages.length);

  const handleShowSearch = () => setShowSearch(true);

  const handleExitSearch = () => {
    setShowSearch(false);
    setSearchValue("");
  };

  const handleSearchValue = e => {
    const value = e.target.value;
    setSearchValue(value);
  };

  return (
    <Grid padded columns={1} style={styles.stacked} fluid="true">
      <Grid.Column style={styles.compact}>
        <MessagesHeader
          currentUser={currentUser}
          currentChannel={currentChannel}
          handleSearch={!showSearch ? handleShowSearch : handleExitSearch}
          showSearch={showSearch}
        />
      </Grid.Column>

      <Grid.Column style={styles["fill-height-available"]}>
        <Comment.Group>
          {messages.map(message => (
            <Message
              key={message.timestamp}
              message={message}
              currentUser={currentUser}
            />
          ))}
          <div ref={bottomRef} />
        </Comment.Group>
      </Grid.Column>

      <Grid.Column style={styles.compact}>
        {!showSearch ? (
          <MessagesForm
            currentUser={currentUser}
            currentChannel={currentChannel}
          />
        ) : (
          <SearchMessages
            onChange={handleSearchValue}
            isSearching={isSearching}
            isVisible={showSearch}
            handleExit={handleExitSearch}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Messages;
