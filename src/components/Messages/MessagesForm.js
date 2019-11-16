import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import { useSelector } from "react-redux";
import firebase from "../../firebase/firebase";

const useStyle = createUseStyles({
  messages__form: {
    "&.ui": {
      position: "fixed",
      bottom: "1em",
      marginLeft: 320,
      left: 0,
      right: "1em",
      zIndex: 200
    }
  },
  messages__input: {
    marginBottom: "0.7em"
  }
});

const MessagesForm = ({ messagesRef }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const styles = useStyle();
  const { user, channelId } = useSelector(({ userData, channels }) => ({
    user: userData.currentUser,
    channelId: channels.selectedChannel
  }));
  const onChangeHandler = e => setMessage(e.target.value);
  const sendMessage = () => {
    if (message) {
      setLoading(true);
      messagesRef
        .child(channelId)
        .push()
        .set(createMessage())
        .then(() => {
          setMessage("");
          setLoading(false);
        })
        .catch(e => {
          console.log(e);
          setLoading(false);
          setErrors(prevErrors => [...prevErrors, e]);
        });
    } else {
      setErrors(prevErrors => [...prevErrors, { message: "Add a message" }]);
    }
  };

  const createMessage = () => {
    return {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      },
      content: message
    };
  };

  return (
    <Segment className={styles.messages__form}>
      <Input
        fluid
        onChange={onChangeHandler}
        name="message"
        className={styles.messages__input}
        label={<Button icon="add" />}
        labelPosition="left"
        placeholder="Write your message"
        value={message}
        error={errors.some(error => error.message.includes("message"))}
      />
      <Button.Group icon widths="2">
        <Button
          color="orange"
          content="Add reply"
          labelPosition="left"
          icon="edit"
          disabled={loading}
          onClick={sendMessage}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
};

export default MessagesForm;
