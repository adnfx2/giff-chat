import React, { useState } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState();
  const authorized = ["image/jpeg", "image/png"];

  const clearFile = () => setFile(null);

  const isAuthorized = filename => authorized.includes(mime.lookup(filename));

  const addFile = event => {
    const _file = event.target.files[0];
    if (_file) {
      setFile(event.target.files[0]);
    }
  };

  const sendFile = () => {
    if (file && isAuthorized(file.name)) {
      const metadata = {
        contentType: mime.lookup(file.name)
      };
      uploadFile(file, metadata);
      closeModal();
      clearFile();
    }
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          onChange={addFile}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={sendFile}>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
