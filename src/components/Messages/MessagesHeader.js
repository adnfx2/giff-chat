import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Header, Segment, Input, Icon } from "semantic-ui-react";
import { toggleStar } from "../../actions";
import firebase from "../../firebase/firebase";

const useFirebaseDB = reference => {
  return useState(firebase.database().ref(reference));
};

const displayName = (channel, isPrivate) => {
  if (!channel) {
    return "NoChannel";
  }
  return `${isPrivate ? "@" : "#"}${channel.name}`;
};

const MessagesHeader = ({
  starredChannel,
  setStarredChannel,
  channel,
  members,
  searchHandler,
  searchLoading,
  isPrivateChannel,
  currentUser
}) => {
  const [usersRef] = useFirebaseDB("users");
  const membersCount = Object.keys(members).length;
  const totalMembers = `${membersCount} ${
    membersCount === 1 ? "User" : "Users"
  }`;

  const starHandler = () => {
    console.log({ starredChannel, channel });
    if (!starredChannel) {
      console.log("add");
      usersRef.child(`${currentUser.uid}/starred`).update({
        [channel.id]: {
          name: channel.name,
          details: channel.topic,
          createdBy: {
            name: channel.createdBy.name,
            avatar: channel.createdBy.avatar
          }
        }
      });
      setStarredChannel(true);
    } else {
      console.log("remove");
      usersRef
        .child(`${currentUser.uid}/starred`)
        .child(channel.id)
        .remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
      setStarredChannel(false);
    }
  };

  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {displayName(channel, isPrivateChannel)}
          {!isPrivateChannel && channel && (
            <Icon
              onClick={starHandler}
              name={`${starredChannel ? "star" : "star outline"}`}
              color={`${starredChannel ? "yellow" : "black"}`}
            />
          )}
        </span>
        <Header.Subheader>
          {membersCount > 0 ? totalMembers : ""}
        </Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          loading={searchLoading}
          onChange={searchHandler}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
