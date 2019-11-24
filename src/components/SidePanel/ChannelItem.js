import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Label } from "semantic-ui-react";
import { setChannel } from "../../actions";
import firebase from "../../firebase/firebase";

const useFirebaseDB = reference => {
  return useState(firebase.database().ref(reference));
};

const useNotificationListener = (channelsRef, selectedChannel, channel) => {
  const [messagesRef] = useFirebaseDB("messages");
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    messagesRef.child(channel.id).on("value", snap => {
      console.log("effect in channelitem -> " + channel.name);
      const selectedChannelId = selectedChannel.id;
      const channelId = channel.id;
      const numChildren = snap.numChildren();
      setNotifications(prevNotifications => {
        if (prevNotifications === null) {
          return {
            total: numChildren,
            lastKnownTotal: numChildren,
            count: 0
          };
        }

        const messagesRecieved = numChildren - prevNotifications.lastKnownTotal;
        console.log(messagesRecieved);
        if (selectedChannelId !== channelId) {
          if (messagesRecieved > 0) {
            return {
              ...prevNotifications,
              total: numChildren,
              count: messagesRecieved
            };
          } else {
            return {
              ...prevNotifications,
              total: numChildren,
              lastKnownTotal: numChildren
            };
          }
        }

        return {
          ...prevNotifications,
          total: numChildren,
          lastKnownTotal: numChildren,
          count: 0
        };
      });
    });
    return () =>
      console.log("effect off") || messagesRef.child(channel.id).off();
  }, [selectedChannel]); //eslint-disable-line

  return [notifications, setNotifications];
};

const ChannelItem = ({ channel, channelsRef }) => {
  const selectedChannel = useSelector(state => state.channels.selectedChannel);

  const dispatch = useDispatch();
  const changeChannelHandler = channel => dispatch(setChannel(channel));

  const [notificationData] = useNotificationListener(
    channelsRef,
    selectedChannel,
    channel
  );

  const notificationCount = notificationData ? notificationData.count : 0;

  return (
    <React.Fragment>
      <Menu.Item
        onClick={() => changeChannelHandler(channel)}
        name={channel.name}
        active={selectedChannel.id === channel.id}
      >
        {notificationCount ? (
          <Label color="red">{notificationCount}</Label>
        ) : (
          ""
        )}
        # {channel.name}
      </Menu.Item>
    </React.Fragment>
  );
};

export default ChannelItem;
