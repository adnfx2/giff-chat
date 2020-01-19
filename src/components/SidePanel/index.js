import React from "react";
import { Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import UserPanel from "./UserPanel";
import StarredChannels from "./StarredChannels";
import PublicChannels from "./PublicChannels";
import DirectMessages from "./DirectMessages";

const styles = {
  sidePanel: {
    height: "100%",
    marginBottom: 0,
    borderRadius: 0,
    overflowY: "scroll",
    background: "#4c3c4c"
  }
};

const SidePanel = ({ className }) => {
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const currentChannel = useSelector(state => state.currentChannel);

  return (
    <Menu
      size="large"
      inverted
      vertical
      style={styles.sidePanel}
      className={className}
    >
      <UserPanel currentUser={currentUser} />
      <StarredChannels currentChannel={currentChannel} />
      <PublicChannels
        currentUser={currentUser}
        currentChannel={currentChannel}
      />
      <DirectMessages
        currentUser={currentUser}
        currentChannel={currentChannel}
      />
    </Menu>
  );
};

export default SidePanel;
