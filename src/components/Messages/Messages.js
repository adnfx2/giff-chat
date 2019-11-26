import React, { useState, useEffect } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import { createUseStyles } from "react-jss";
import firebase from "../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { loadMessage } from "../../actions";
import Message from "./Message";

const useFirebaseDB = reference => {
  return useState(firebase.database().ref(reference));
};

const useStarredListener = (usersRef, channelId, currentUserId) => {
  const [starredChannel, setStarredChannel] = useState(false);

  useEffect(() => {
    console.log({ channelId });
    if (!channelId) return;

    usersRef
      .child(currentUserId)
      .child("starred")
      .once("value")
      .then(data => {
        console.log("running starred", data.val());
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          console.log({ channelId });
          setStarredChannel(
            prevState =>
              console.log({ channelIds, prevStarred, prevState, channelId }) ||
              prevStarred
          );
        }
      });
  }, [channelId]); //eslint-disable-line

  return [starredChannel, setStarredChannel];
};

const useLoadMessage = (messagesRef, channelId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(
      `currentChannel: ${channelId}, ${
        !channelId ? "no channel yet!" : "channel found"
      }`
    );
    if (channelId) {
      let messages = [];
      let uniqueUsers = {};
      messagesRef.child(channelId).on("child_added", snap => {
        const message = snap.val();
        messages = [...messages, message];
        uniqueUsers = { ...uniqueUsers, [message.user.id]: message.user };
        dispatch(loadMessage(messages, channelId, uniqueUsers));
      });

      return () => messagesRef.off();
    }
  }, [channelId]); //eslint-disable-line
};

const useStyle = createUseStyles({
  messages: {
    height: 440,
    overflowY: "scroll"
  }
});

const Messages = () => {
  const [searchResults, setSearchResults] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [usersRef] = useFirebaseDB("users");
  const [messagesRef] = useFirebaseDB("messages");
  const [privateMessagesRef] = useFirebaseDB("privateMessages");
  const styles = useStyle();
  const { channels, messages, user, members } = useSelector(
    ({ userData, channels, messages }) => {
      const { selectedChannel } = channels;
      const messagesOfSelectedChannel =
        messages.byChannelId[selectedChannel.id];
      let allMessages = [];
      let allMembers = {};
      if (selectedChannel && messagesOfSelectedChannel) {
        allMessages = messagesOfSelectedChannel.messages;
        allMembers = messagesOfSelectedChannel.members;
      }

      return {
        channels,
        messages: allMessages,
        members: allMembers,
        user: userData.currentUser
      };
    }
  );

  const finalMessagesRef = channels.privateChannel
    ? privateMessagesRef
    : messagesRef;

  useLoadMessage(finalMessagesRef, channels.selectedChannel.id);

  const searchHandler = event => {
    setSearchLoading(true);
    const searchTerm = event.target.value;
    const _messages = messages.slice();
    const regex = new RegExp(searchTerm, "gi");
    const _searchResults =
      searchTerm &&
      _messages.reduce((acc, message) => {
        if (
          message.content &&
          (message.content.match(regex) || message.user.name.match(regex))
        ) {
          acc.push(message);
        }
        return acc;
      }, []);
    setSearchResults(_searchResults);
    setTimeout(() => setSearchLoading(false), 1000);
  };

  const finalMessages = searchResults || messages;

  const [starredChannel, setStarredChannel] = useStarredListener(
    usersRef,
    channels.selectedChannel.id,
    user.uid
  );

  return (
    <React.Fragment>
      <MessagesHeader
        starredChannel={starredChannel}
        setStarredChannel={setStarredChannel}
        channel={channels.selectedChannel}
        isPrivateChannel={channels.privateChannel}
        members={members}
        searchHandler={searchHandler}
        searchLoading={searchLoading}
        currentUser={user}
      />
      <Segment>
        <Comment.Group className={styles.messages}>
          {finalMessages.map(message => (
            <Message key={message.timestamp} message={message} user={user} />
          ))}
        </Comment.Group>
      </Segment>
      <MessagesForm
        messagesRef={finalMessagesRef}
        isPrivateChannel={channels.privateChannel}
      />
    </React.Fragment>
  );
};

export default Messages;
