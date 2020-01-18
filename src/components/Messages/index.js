import React, { useState, useEffect } from "react";
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

let prevTimeout = null;

const createTimeout = (handler, ms) => {
  if (prevTimeout) {
    clearTimeout(prevTimeout);
  }
  prevTimeout = setTimeout(handler, ms);
};

const filterMessages = (messages, searchTerm) => {
  const regex = new RegExp(searchTerm, "gi");
  const filteredMessages = messages.reduce((acc, message) => {
    if (
      (message.content && message.content.match(regex)) ||
      message.user.name.match(regex)
    ) {
      acc.push(message);
    }
    return acc;
  }, []);
  return filteredMessages;
};

const useSearchMessages = (messages, searchTerm) => {
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (messages && messages.length > 0 && searchTerm) {
      setIsSearching(true);
      const filteredMessages = filterMessages(messages, searchTerm);
      createTimeout(() => {
        setIsSearching(false);
        setSearchResult(filteredMessages);
      }, 1000);
    } else {
      setIsSearching(false);
      setSearchResult(null);
    }
  }, [messages, searchTerm]);
  return [isSearching, searchResult];
};

const Messages = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const currentChannel = useSelector(state => state.currentChannel);
  const allMessages = useSelector(state => state.messages[currentChannel.id]);
  const searchStatus = useSearchMessages(allMessages, searchValue);
  const [isSearching, searchResult] = searchStatus;
  const messages = searchResult || allMessages;

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
