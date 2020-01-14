import React from "react";
import { Menu, Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { sagaActions } from "../../../authentication/sagas";

const styles = {
  userPanel: {
    background: "#4c3c4c"
  },
  header: {
    padding: "1.2em",
    margin: 0
  },
  dropdown: {
    padding: "0.25em"
  }
};

const UserPanel = ({  currentUser   })=> {
  const dispatch = useDispatch();
  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{currentUser.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: (
        <span
          onClick={() => {
            dispatch(sagaActions.logoutRequested());
          }}
        >
          Sign Out
        </span>
      )
    }
  ];

  return (
    <Menu.Item>
      <Grid style={styles.userPanel}>
        <Grid.Column>
          <Grid.Row>
            <Header inverted as="h2" style={styles.header}>
              <Icon name="american sign language interpreting" />
              <Header.Content>Giff</Header.Content>
            </Header>
          </Grid.Row>
          <Grid.Row>
            <Header style={styles.dropdown} inverted as="h4">
              <Dropdown
                trigger={
                  <span>
                    <Image src={currentUser.photoURL} spaced="right" avatar />
                    {currentUser.displayName}
                  </span>
                }
                options={dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Menu.Item>
  );
};

export default UserPanel;
