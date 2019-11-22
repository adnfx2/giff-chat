import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { createUseStyles } from "react-jss";
import { loadUsers, setChannel } from "../../actions";
import firebase from "../../firebase/firebase";

const useStyle = createUseStyles({
  dm: {
    paddingBottom: "2em"
  },
  dm__item: {
    opacity: 0.7,
    fontStyle: "italic"
  }
});

const useFirebaseDB = reference => {
  return useState(firebase.database().ref(reference));
};

const useLoadUsers = (
  usersRef,
  connectedRef,
  presenceRef,
  currentUser,
  addStatusUser
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadedUsers = [];
    usersRef.on("child_added", snap => {
      if (currentUser.uid !== snap.key) {
        const user = snap.val();
        const finalUser = { ...user, uid: snap.key, status: "offline" };
        loadedUsers.push(finalUser);
        dispatch(loadUsers(loadedUsers));
      }
    });

    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUser.uid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    presenceRef.on("child_added", snap => {
      if (currentUser.uid !== snap.key) {
        addStatusUser(snap.key);
      }
    });

    presenceRef.on("child_removed", snap => {
      if (currentUser.uid !== snap.key) {
        addStatusUser(snap.key, false);
      }
    });

    return () => usersRef.off();
  }, []); //eslint-disable-line
};

const getChannelId = (currentUser, user) =>
  user < currentUser.uid
    ? `${user.uid}/${currentUser.uid}`
    : `${currentUser.uid}/${user.uid}`;

const DirectMessages = ({ currentUser }) => {
  const styles = useStyle();
  const [usersRef] = useFirebaseDB("users");
  const [connectedRef] = useFirebaseDB(".info/connected");
  const [presenceRef] = useFirebaseDB("presence");
  const { users, selectedChannel } = useSelector(state => ({
    users: state.users,
    selectedChannel: state.channels.selectedChannel
  }));
  const dispatch = useDispatch();

  const addStatusUser = (userId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user.status = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    dispatch(loadUsers(updatedUsers));
  };

  const changeChannel = user => {
    const channelId = getChannelId(currentUser, user);

    const channelData = {
      id: channelId,
      name: user.name
    };

    dispatch(setChannel(channelData, true));
  };

  useLoadUsers(usersRef, connectedRef, presenceRef, currentUser, addStatusUser);

  return (
    <Menu.Menu className={styles.dm}>
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({0})
      </Menu.Item>
      {users.map(user => (
        <Menu.Item
          key={user.uid}
          onClick={() => changeChannel(user)}
          className={styles.dm__item}
          active={selectedChannel.id === getChannelId(currentUser, user)}
        >
          <Icon
            name="circle"
            color={user.status === "online" ? "green" : "red"}
          />
          @ {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;
