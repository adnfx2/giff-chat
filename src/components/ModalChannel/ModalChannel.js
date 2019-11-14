import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import firebase from "../../firebase/firebase";
import { Button, Icon, Modal, Input, Form } from "semantic-ui-react";
import { loadChannels } from "../../actions";

const useLoadChannels = channelsRef => {
  const dispatch = useDispatch();

  useEffect(() => {
    channelsRef.on("child_added", snap => {
      const channel = snap.val();
      console.log(channel);
      dispatch(loadChannels(channel));
    });
  }, []); //eslint-disable-line
};

const validationSchema = Yup.object().shape({
  channelName: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/)
    .min(5)
    .max(15)
    .required(),
  channelTopic: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/)
    .min(5)
    .max(15)
    .required()
});

const getValidationErrors = (errors, touched) => {
  const fields = Object.keys(errors);
  const initialValues = { errorsFlags: {}, errorsMessages: [] };
  return fields.reduce((result, field) => {
    if (touched[field] || field === "fromServer") {
      return {
        errorsFlags: { ...result.errorsFlags, [field]: true },
        errorsMessages: [...result.errorsMessages, errors[field]]
      };
    }
    return result;
  }, initialValues);
};

const ModalChannel = ({ visibility, onCloseHandler, currentUser }) => {
  const [channelsRef, setChannelsRef] = useState(
    firebase.database().ref("channels")
  );
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm
  } = useFormik({
    initialValues: {
      channelName: "",
      channelTopic: ""
    },
    validationSchema: validationSchema,
    onSubmit: f => console.log("submittingg") || addChannel()
  });

  useLoadChannels(channelsRef);

  const { errorsFlags } = getValidationErrors(errors, touched);

  const addChannel = () => {
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: values.channelName,
      topic: values.channelTopic,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        resetForm();
        onCloseHandler();
        console.log("channel added");
      })
      .catch(err => console.log(err));
  };

  return (
    <Modal basic open={visibility} onClose={onCloseHandler}>
      <Modal.Header>Add a Channel</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <Input
              fluid
              label="Name of Channel"
              name="channelName"
              type="channelName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.channelName}
              error={errorsFlags.channelName}
            />
          </Form.Field>

          <Form.Field>
            <Input
              fluid
              label="Channel Topic"
              name="channelTopic"
              type="channelTopic"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.channelTopic}
              error={errorsFlags.channelTopic}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={e => {
            console.log("submit");
            handleSubmit(e);
          }}
        >
          <Icon name="checkmark" /> Add
        </Button>
        <Button color="red" onClick={() => onCloseHandler()}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalChannel;
