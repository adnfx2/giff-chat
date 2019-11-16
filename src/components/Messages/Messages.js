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

const useLoadMessage = messagesRef => {
  const dispatch = useDispatch();
  const channelId = useSelector(state => state.channels.selectedChannel);

  useEffect(() => {
    console.log(
      `currentChannel: ${channelId}, ${
        !channelId ? "no channel yet!" : "channel found"
      }`
    );
    if (channelId) {
      messagesRef.child(channelId).on("child_added", snap => {
        const message = snap.val();
        dispatch(loadMessage(message));
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
  const { messages, user } = useSelector(state => ({
    messages: state.messages.loadedMessages,
    user: state.userData.currentUser
  }));

  useLoadMessage(messagesRef);

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
