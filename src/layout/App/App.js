import React, { useState, useEffect } from "react";
import { Sidebar, Responsive } from "semantic-ui-react";
import SidePanel from "../../components/SidePanel";
import MainPanel from "../../components/MainPanel/MainPanel";
import Messages from "../../components/Messages";
import { createUseStyles } from "react-jss";

const useResize = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const callback = () => setHeight(window.innerHeight);

    window.addEventListener("resize", callback);

    return () => window.removeEventListener("resize", callback);
  }, []);

  return height;
};

const useMobileStyles = createUseStyles({
  "container--mobile": {
    composes: ["h-100"],
    display: "flex",
    flexDirection: "column"
  },
  "chat--mobile": {
    flex: "1 1 0"
  },
  sidebar: {
    "&.ui.left": {
      width: "auto",
      overflow: "hidden",
      background: "#4c3c4c"
    }
  }
});

const MobileNavbar = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const styles = useMobileStyles();

  const handleHideSidePanel = () => visible && setVisible(false);
  const handleToggleSidePanel = () => setVisible(prevState => !prevState);

  return (
    <Sidebar.Pushable>
      <Sidebar
        animation="overlay"
        icon="labeled"
        visible={visible}
        className={styles.sidebar}
      >
        <SidePanel />
      </Sidebar>
      <Sidebar.Pusher
        onClick={handleHideSidePanel}
        dimmed={visible}
        className="h-100"
      >
        <div className={styles["container--mobile"]}>
          <MainPanel onClick={handleToggleSidePanel} />
          <div className={styles["chat--mobile"]}>{children}</div>
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

const useDesktopStyles = createUseStyles({
  "desktop-wrapper": {
    display: "flex",
    height: "100%"
  }
});

const DesktopNavbar = ({ children, ...props }) => {
  const styles = useDesktopStyles();

  return (
    <div className={styles["desktop-wrapper"]}>
      <SidePanel />
      {children}
    </div>
  );
};

const useAppStyles = createUseStyles({
  "device-height": {
    overflow: "hidden",
    height: props => (props ? props.deviceHeight : "100vh")
  }
});

const App = () => {
  const deviceHeight = useResize();
  const styles = useAppStyles({ deviceHeight });

  return (
    <React.Fragment>
      <Responsive
        {...Responsive.onlyMobile}
        className={styles["device-height"]}
      >
        <MobileNavbar>
          <Messages />
        </MobileNavbar>
      </Responsive>
      <Responsive
        minWidth={Responsive.onlyTablet.minWidth}
        className={styles["device-height"]}
      >
        <DesktopNavbar>
          <Messages />
        </DesktopNavbar>
      </Responsive>
    </React.Fragment>
  );
};

export default App;
