import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import ModalChannel from "../../components/ModalChannel/ModalChannel";

const useStyle = createUseStyles({
  channels: {
    paddingBottom: "2em"
  }
});

const Channels = ({ currentUser }) => {
  const [toggleModalChannel, setToggleModalChannel] = useState(false);
  const channels = useSelector(state => state.channels);
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
        {channels.length > 0
          ? channels.map(channel => (
              <Menu.Item
                key={channel.id}
                onClick={() => console.log("ch click")}
                name={channel.name}
              >
                # {channel.name}
              </Menu.Item>
            ))
          : ""}
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
