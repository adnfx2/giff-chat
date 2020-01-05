import React from "react";
import { Menu } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import UserPanel from "./UserPanel";
//import Channels from "./Channels";
//import DirectMessages from "./DirectMessages";
//import Starred from "./Starred";

const useStyle = createUseStyles({
  sidePanel: {
    "&.ui.menu": {
      background: "#4c3c4c",
      height: "100%",
      borderRadius: 0,
      overflowY: "scroll"
    }
  }
});

const SidePanel = ({ currentUser, className }) => {
  const styles = useStyle();

  return (
    <Menu
      size="large"
      inverted
      vertical
      className={`${styles.sidePanel} ${className || ""}`.trim()}
    >
      <UserPanel currentUser={currentUser} />
      {`
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
     `}
    </Menu>
  );
};

export default SidePanel;
