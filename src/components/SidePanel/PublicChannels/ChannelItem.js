import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Label } from "semantic-ui-react";
import { actions } from "./reducer";
import firebase from "../../../firebase/firebase";

const useFirebaseDB = reference => {
  return useState(firebase.database().ref(reference));
};

const useNotificationListener = (channelsRef, selectedChannelId, channel) => {
  const [messagesRef] = useFirebaseDB("messages");
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    messagesRef.child(channel.id).on("value", snap => {
      console.log("effect in channelitem -> " + channel.name);
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
              total: numChildren,
              ...prevNotifications,
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
  }, [selectedChannelId]); //eslint-disable-line

  return [notifications, setNotifications];
};

const ChannelItem = ({ channel, channelsRef, channelId }) => {
  const selectedChannelId = useSelector(state => state.currentChannel);

  const dispatch = useDispatch();
  const changeChannelHandler = channel => dispatch(actions.setChannel(channel));

  const [notificationData] = useNotificationListener(
    channelsRef,
    selectedChannelId,
    channel
  );

  const notificationCount = notificationData ? notificationData.count : 0;

  return (
    <React.Fragment>
      <Menu.Item
        onClick={() => changeChannelHandler(channel)}
        name={channel.name}
        active={selectedChannelId === channelId}
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
