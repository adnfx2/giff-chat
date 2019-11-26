import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import firebase from "../../firebase/firebase";

const usersRef = firebase.database().ref("users");

const useStyle = createUseStyles({
  starredChannels: {
    paddingBottom: "2em"
  },
  starredChannels__item: {
    opacity: 0.7,
    fontStyle: "italic"
  }
});

const useStarredsListener = currentUser => {
  useEffect(() => {
    if (!currentUser) return;
    console.log("adding listeners");
    const starredsRef = usersRef.child(currentUser.uid).child("starred");

    starredsRef.on("child_added", snap => {
      const starredChannels = { id: snap.key, ...snap.val() };
      console.log({ starredChannelListener: starredChannels });
    });

    starredsRef.on("child_removed", snap => {
      const channelToRemove = { id: snap.key, ...snap.val() };
      console.log({ channelToRemoveListener: channelToRemove });
    });

    return () => {
      console.log("removing listeners");
      starredsRef.off();
    };
  }, [currentUser]);
};

const Starred = ({ currentUser }) => {
  const styles = useStyle();
  const starredChannels = useSelector(state => state.starredChannels) || [];
  useStarredsListener(currentUser);

  return (
    <Menu.Menu className={styles.starredChannels}>
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>{" "}
        ({starredChannels.length}){" "}
      </Menu.Item>
      {starredChannels.map(starredChannel => (
        <Menu.Item
          key={starredChannel.uid}
          onClick={() => "changeChannel(starredChannel)"}
          className={styles.starredChannels__items}
          active={false}
        >
          {starredChannel.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default Starred;
