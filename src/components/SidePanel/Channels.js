import React, { useState } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import ModalChannel from "../../components/ModalChannel/ModalChannel";

const useStyle = createUseStyles({
  channels: {
    paddingBottom: "2em"
  }
});

const Channels = ({ currentUser }) => {
  const [channels, setChannels] = useState([]);
  const [toggleModalChannel, setToggleModalChannel] = useState(false);
  const styles = useStyle();

  return (
    <React.Fragment>
      <Menu.Menu className={styles.channels}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}){" "}
          <Icon name="add" onClick={() => setToggleModalChannel(true)} />
        </Menu.Item>
      </Menu.Menu>
      <ModalChannel
        currentUser={currentUser}
        visibility={toggleModalChannel}
        onCloseHandler={() => setToggleModalChannel(false)}
      />
    </React.Fragment>
  );
};

export default Channels;
