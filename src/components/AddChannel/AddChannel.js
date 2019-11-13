import React, { useState } from "react";
import { Button, Icon, Modal, Input, Form } from "semantic-ui-react";

const AddChannel = ({ visibility, onCloseHandler }) => {
  const [inputFields, setInputFields] = useState({
    channelName: "",
    channelTopic: ""
  });

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setInputFields(prevInputFields => ({
      ...prevInputFields,
      [name]: value
    }));
  };

  return (
    <Modal basic open={visibility} onClose={onCloseHandler}>
      <Modal.Header>Add a Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              fluid
              label="Name of Channel"
              name="channelName"
              onChange={onChangeHandler}
              value={inputFields.channelName}
            />
          </Form.Field>
        </Form>
        <Form.Field>
          <Input
            fluid
            label="Channel Topic"
            name="channelTopic"
            onChange={onChangeHandler}
            value={inputFields.channelTopic}
          />
        </Form.Field>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={() => console.log("add")}>
          <Icon name="checkmark" /> Add
        </Button>
        <Button color="red" onClick={() => onCloseHandler()}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddChannel;
