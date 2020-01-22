import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { actions, defaultTextStatus, defaultFileStatus } from "./reducer";
import { sagaActions } from "./sagas";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

const styles = {
  messages__formRemove: {
    position: "fixed",
    bottom: "1em",
    marginLeft: 320,
    left: 0,
    right: "1em",
    zIndex: 200
  },
  messages__input: {
    marginBottom: "0.7em"
  }
};

const MessagesForm = ({ currentUser, currentChannel }) => {
  const currentChannelId = currentChannel.id;
  const dispatch = useDispatch();
  const { textDrafts, fileDrafts } = useSelector(state => state.sendStatus);
  const textStatus = textDrafts[currentChannelId] || defaultTextStatus;
  const fileStatus = fileDrafts[currentChannelId] || defaultFileStatus;
  const { message, isSendingTextMessage } = textStatus;
  const { isUploading, isSendingFileMessage, percentUploaded } = fileStatus;
  const [toggleFileModal, setToggleFileModal] = useState(false);
  const isPrivateChannel = currentChannel.isPrivate;

  const openModal = () => setToggleFileModal(true);

  const closeModal = () => setToggleFileModal(false);

  const handleInputOnChange = e => {
    const value = e.target.value;
    dispatch(actions.typingTextMessage(currentChannelId, value));
  };

  const handleSendMessage = () => {
    dispatch(
      sagaActions.sendTextMessageRequest(currentUser, currentChannel, message)
    );
  };

  const handleKeyDown = e => {
    if (e.ctrlKey && e.keyCode === 13) {
      handleSendMessage();
    }
  };

  const handleSendFile = (file, metadata) => {
    const payload = {
      currentUser,
      currentChannelId,
      file,
      metadata,
      isPrivateChannel
    };
    dispatch(sagaActions.sendFileMessageRequest(payload));
  };

  return (
    <React.Fragment>
      <Segment style={styles.messages__form}>
        <Input
          fluid
          onChange={handleInputOnChange}
          name="message"
          style={styles.messages__input}
          label={<Button icon="add" onClick={openModal} />}
          labelPosition="left"
          onKeyDown={handleKeyDown}
          placeholder="Write your message"
          value={message}
          error={textStatus.error ? true : false}
        />
        <Button.Group icon widths="2">
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="left"
            icon="cloud upload"
            disabled={!currentChannelId || isUploading || isSendingFileMessage}
            onClick={openModal}
          />
          <Button
            color="blue"
            content="Send"
            labelPosition="right"
            icon="send"
            disabled={!currentChannelId || !message || isSendingTextMessage}
            onClick={handleSendMessage}
          />
        </Button.Group>
        <ProgressBar
          isUploading={isUploading}
          percentUploaded={percentUploaded}
        />
      </Segment>
      <FileModal
        modal={toggleFileModal}
        closeModal={closeModal}
        sendFileHandler={handleSendFile}
      />
    </React.Fragment>
  );
};

export default MessagesForm;
