import React, { useState } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";

const useStyle = createUseStyles({
  "direct-messages": {
    paddingBottom: "2em"
  }
});

const DirectMessages = props => {
  const styles = useStyle();

  return (
    <Menu.Menu className={styles["direct-messages"]}>
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({0})
      </Menu.Item>
    </Menu.Menu>
  );
};

export default DirectMessages;
