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
  const [messagesRef] = useFirebaseDB("messages");
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
  useLoadMessage(messagesRef, channels.selectedChannel.id);

  return (
    <React.Fragment>
      <MessagesHeader channel={channels.selectedChannel} members={members} />
      <Segment>
        <Comment.Group className={styles.messages}>
          {messages.map(message => (
            <Message key={message.timestamp} message={message} user={user} />
          ))}
        </Comment.Group>
      </Segment>
      <MessagesForm messagesRef={messagesRef} />
    </React.Fragment>
  );
};

export default Messages;
