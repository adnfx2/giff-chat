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
      messagesRef.child(channelId).on("child_added", snap => {
        const message = snap.val();
        messages = [...messages, message];
        dispatch(loadMessage(messages, channelId));
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

const Messages = ({ channels }) => {
  const [messagesRef] = useFirebaseDB("messages");
  const styles = useStyle();
  const { channelId, messages, user } = useSelector(
    ({ userData, channels, messages }) => {
      const channelId = channels.selectedChannel;
      const _messages = messages.loadedMessages[channelId] || [];
      return {
        channelId,
        messages: _messages,
        user: userData.currentUser
      };
    }
  );
  console.log({ channelId, messages, user });
  useLoadMessage(messagesRef, channelId);

  return (
    <React.Fragment>
      <MessagesHeader />
      <Segment>
        <Comment.Group className={styles.messages}>
          {console.log(messages) ||
            messages.map(message => (
              <Message key={message.timestamp} message={message} user={user} />
            ))}
        </Comment.Group>
      </Segment>
      <MessagesForm messagesRef={messagesRef} />
    </React.Fragment>
  );
};

export default Messages;
