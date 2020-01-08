import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import StarredChannels from "./StarredChannels";
import PublicChannels from "./PublicChannels";
import DirectMessages from "./DirectMessages";

const styles = {
  sidePanel: {
    background: "#4c3c4c",
    height: "100%",
    borderRadius: 0,
    overflowY: "scroll"
  }
};

const SidePanel = ({ className }) => {
  return (
    <Menu
      size="large"
      inverted
      vertical
      style={styles.sidePanel}
      className={className}
    >
      <UserPanel />
      <StarredChannels />
      <PublicChannels />
      <DirectMessages />
    </Menu>
  );
};

export default SidePanel;
