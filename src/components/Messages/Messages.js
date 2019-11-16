import React, { useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import { createUseStyles } from "react-jss";
import firebase from "../../firebase/firebase";

const useFirebaseDB = reference => {
  return useState(firebase.database().ref(reference));
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
  console.log(messagesRef);

  return (
    <React.Fragment>
      <MessagesHeader />
      <Segment>
        <Comment.Group className={styles.messages}>Messages</Comment.Group>
      </Segment>
      <MessagesForm messagesRef={messagesRef} />
    </React.Fragment>
  );
};

export default Messages;
