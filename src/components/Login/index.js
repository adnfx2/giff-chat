import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Formik } from "formik";
import * as Yup from "yup";
import { createUseStyles } from "react-jss";
import { sagaActions } from "../../authentication/sagas";

const useStyle = createUseStyles({
  container: {
    height: "100vh",
    background: "var(--bg-white)"
  },
  form: {
    maxWidth: 450
  }
});

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must have at least 6 characters")
    .required("Password is required")
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

const Login = props => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const asyncErrorMessage = useSelector(({ auth }) => auth.login.asyncError);
  const isLoading = useSelector(({ auth }) => auth.login.isLoading);
  const handleOnSubmit = userCredentials => {
    dispatch(sagaActions.loginSubmitted(userCredentials));
  };

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
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleOnSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit
          }) => {
            const { errorsFlags, errorsMessages } = getValidationErrors(
              errors,
              touched
            );
            return (
              <React.Fragment>
                <Form size="large" onSubmit={handleSubmit}>
                  <Segment stacked>
                    <h2>Login</h2>
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

                    <Button
                      color="black"
                      fluid
                      size="large"
                      disabled={isLoading}
                      loading={isLoading}
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
                {asyncErrorMessage ? (
                  <Message error>{asyncErrorMessage}</Message>
                ) : (
                  ""
                )}
              </React.Fragment>
            );
          }}
        </Formik>
        <Message>
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
