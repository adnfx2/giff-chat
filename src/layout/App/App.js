import React from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "../../components/ColorPanel/ColorPanel";
import SidePanel from "../../components/SidePanel/SidePanel";
import Messages from "../../components/Messages/Messages";
import MetaPanel from "../../components/MetaPanel/MetaPanel";
import { createUseStyles } from "react-jss";

const useStyle = createUseStyles({
  app: {
    background: "#eee"
  },
  messages: {
    marginLeft: 320
  }
});

const App = () => {
  const styles = useStyle();

  return (
    <Grid columns="equal" className={styles.app}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column className={styles.messages}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

export default App;
