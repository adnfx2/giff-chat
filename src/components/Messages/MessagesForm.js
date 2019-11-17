import React, { useState, useEffect } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import { useSelector } from "react-redux";
import uuidv4 from "uuid/v4";
import firebase from "../../firebase/firebase";
import FileModal from "../FileModal/FileModal";

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
  const [storageRef, setStorageRef] = useState(firebase.storage().ref());
  const [uploadState, setUploadState] = useState("");
  const [uploadTask, setUploadTask] = useState();
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [toggleFileModal, setToggleFileModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const styles = useStyle();
  const { user, channelId } = useSelector(({ userData, channels }) => ({
    user: userData.currentUser,
    channelId: channels.selectedChannel
  }));

  useEffect(() => {
    if (uploadState === "uploading") {
      const pathToUpload = channelId;
      const ref = messagesRef;
      uploadTask.on(
        "state_changed",
        snap => {
          const _percentUploaded = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          setPercentUploaded(_percentUploaded);
        },
        err => {
          setErrors(prevErr => [...prevErr, err]);
          setUploadState("error");
          setUploadTask(null);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadUrl => {
              sendFileMessage(downloadUrl, ref, pathToUpload);
            })
            .catch(err => {
              setErrors(prevErr => [...prevErr, err]);
              setUploadState("error");
              setUploadTask(null);
            });
        }
      );
    }
  }, [uploadState]); //eslint-disable-line

  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileUrl))
      .then(() => {
        setUploadState("done");
      })
      .catch(err => {
        setErrors(prevErr => [...prevErr, errors]);
      });
  };

  const uploadFile = (file, metadata) => {
    const filePath = `chat/public/${uuidv4()}.jpg`;

    setUploadState("uploading");
    setUploadTask(storageRef.child(filePath).put(file, metadata));
  };

  const openModal = () => setToggleFileModal(true);

  const closeModal = () => setToggleFileModal(false);

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
          setLoading(false);
          setErrors(prevErrors => [...prevErrors, e]);
        });
    } else {
      setErrors(prevErrors => [...prevErrors, { message: "Add a message" }]);
    }
  };

  const createMessage = (fileUrl = null) => {
    const msgType =
      fileUrl !== null ? { image: fileUrl } : { content: message };
    return {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      },
      ...msgType
    };
  };

  return (
    <React.Fragment>
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
            onClick={openModal}
          />
        </Button.Group>
      </Segment>
      <FileModal
        modal={toggleFileModal}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
    </React.Fragment>
  );
};

export default MessagesForm;
