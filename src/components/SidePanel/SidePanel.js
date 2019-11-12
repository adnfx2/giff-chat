import React from "react";
import { Menu } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import UserPanel from "../UserPanel/UserPanel";

const useStyle = createUseStyles({
  sidePanel: {
    "&.ui.menu": {
      background: "#4c3c4c",
      fontSize: "1.2rem"
    }
  }
});

const SidePanel = props => {
  const styles = useStyle();

  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      className={styles.sidePanel}
    >
      <UserPanel />
    </Menu>
  );
};

export default SidePanel;
