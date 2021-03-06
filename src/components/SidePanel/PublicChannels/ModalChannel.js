import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Icon, Modal, Input, Form } from "semantic-ui-react";
import { firebaseRefs } from "../../../firebase/firebase";

const validationSchema = Yup.object().shape({
  channelName: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/)
    .min(5)
    .max(15)
    .required(),
  channelTopic: Yup.string()
    .matches(/^[\w\-\s]+$/)
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
    onSubmit: () => createChannel()
  });

  const { errorsFlags } = getValidationErrors(errors, touched);

  const createChannel = () => {
    const key = firebaseRefs.channels.push().key;
    const newChannel = {
      id: key,
      name: values.channelName,
      topic: values.channelTopic,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    firebaseRefs.channels
      .child(key)
      .update(newChannel)
      .then(() => {
        resetForm();
        onCloseHandler();
      })
      .catch(err => console.error({ createChannelError: err }));
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
