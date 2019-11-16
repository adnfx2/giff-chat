import React from "react";
import { Menu } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import UserPanel from "./UserPanel";
import Channels from "./Channels";

const useStyle = createUseStyles({
  sidePanel: {
    "&.ui.menu": {
      background: "#4c3c4c"
    }
  }
});

const SidePanel = ({ currentUser }) => {
  const styles = useStyle();

  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      className={styles.sidePanel}
    >
      <UserPanel currentUser={currentUser} />
      <Channels currentUser={currentUser} />
    </Menu>
  );
};

export default SidePanel;
