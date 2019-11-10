import React from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { Formik } from "formik";
import * as Yup from "yup";
import firebase from "../../firebase/firebase";
import md5 from "md5";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed")
    .min(5, "Username must have at least 5 characters")
    .max(15, "Username is too long")
    .required("Username is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must have at least 6 characters")
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password must match")
    .required("Password confirmation is required")
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

const Register = props => {
  return (
    <Grid
      textAlign="center"
      verticalAlign="middle"
      className={styles.container}
      padded
    >
      <Grid.Column className={styles.form}>
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="american sign language interpreting" color="black">
            Giff
          </Icon>
        </Header>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            passwordConfirmation: ""
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            return firebase
              .auth()
              .createUserWithEmailAndPassword(values.email, values.password)
              .then(createdUser =>
                createdUser.user
                  .updateProfile({
                    displayName: values.username,
                    photoURL: `http://gravatar.com/avatar/${md5(
                      createdUser.user.email
                    )}?d=identicon`
                  })
                  .then(() => {
                    const usersRef = firebase.database().ref("users");
                    console.log(createdUser);
                    return usersRef
                      .child(createdUser.user.uid)
                      .set({
                        name: createdUser.user.displayName,
                        avatar: createdUser.user.photoURL
                      })
                      .then(() => console.log("user saved"));
                  })
              )
              .catch(err => {
                if (err.message.toLowerCase().includes("email")) {
                  setFieldError("email", err.message);
                } else {
                  setFieldError("fromServer", err.message);
                }
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => {
            const { errorsFlags, errorsMessages } = getValidationErrors(
              errors,
              touched
            );
            return (
              <React.Fragment>
                <Form size="large" onSubmit={handleSubmit}>
                  <Segment stacked>
                    <h2>Register</h2>
                    <Form.Input
                      fluid
                      name="username"
                      icon="user"
                      iconPosition="left"
                      placeholder="Username"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      error={errorsFlags.username}
                    />

                    <Form.Input
                      fluid
                      name="email"
                      icon="mail"
                      iconPosition="left"
                      placeholder="Email Address"
                      type="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={errorsFlags.email}
                    />

                    <Form.Input
                      fluid
                      name="password"
                      icon="lock"
                      iconPosition="left"
                      placeholder="Password"
                      type="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      error={errorsFlags.password}
                    />

                    <Form.Input
                      fluid
                      name="passwordConfirmation"
                      icon="repeat"
                      iconPosition="left"
                      placeholder="Password Confirmation"
                      type="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.passwordConfirmation}
                      error={errorsFlags.passwordConfirmation}
                    />

                    <Button
                      color="black"
                      fluid
                      size="large"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Segment>
                </Form>
                {errorsMessages.length ? (
                  <Message error>
                    <Message.List>
                      {errorsMessages.map((err, i) => (
                        <Message.Item key={i}> {err}</Message.Item>
                      ))}
                    </Message.List>
                  </Message>
                ) : (
                  ""
                )}
              </React.Fragment>
            );
          }}
        </Formik>
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
