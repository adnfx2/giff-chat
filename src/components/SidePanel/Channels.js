import React, { useState } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import AddChannel from "../../components/AddChannel/AddChannel";

const useStyle = createUseStyles({
  channels: {
    paddingBottom: "2em"
  }
});

const Channels = props => {
  const [channels, setChannels] = useState([]);
  const [toggleAddChannel, setToggleAddChannel] = useState(false);
  const styles = useStyle();

  return (
    <React.Fragment>
      <Menu.Menu className={styles.channels}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}){" "}
          <Icon name="add" onClick={() => setToggleAddChannel(true)} />
        </Menu.Item>
      </Menu.Menu>
      <AddChannel
        visibility={toggleAddChannel}
        onCloseHandler={() => setToggleAddChannel(false)}
      />
    </React.Fragment>
  );
};

export default Channels;
