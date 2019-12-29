import React from "react";
import { Header, Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  mainpanel: {
    "&.ui.menu": {
      margin: 0,
      borderRadius: 0,
      background: "#4c3c4c"
    }
  },
  menu__header: {
    padding: "1rem 1.25rem"
  }
});

const MainPanel = props => {
  const styles = useStyles();

  return (
    <Menu inverted className={styles.mainpanel}>
      <Menu.Header className={styles.menu__header}>
        <Header inverted as="h2">
          <Icon name="american sign language interpreting" />
          <Header.Content>Giff</Header.Content>
        </Header>
      </Menu.Header>
      <Menu.Item position="right" onClick={() => props.onClick()}>
        <Icon name="sidebar" />
      </Menu.Item>
    </Menu>
  );
};

export default MainPanel;
