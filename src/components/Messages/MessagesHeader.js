import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = ({ channel, members, searchHandler, searchLoading }) => {
  const membersCount = Object.keys(members).length;
  const totalMembers = `${membersCount} ${
    membersCount === 1 ? "User" : "Users"
  }`;

  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channel ? channel.name : "NoChannel"}
          <Icon name={"star outline"} color="black" />
        </span>
        <Header.Subheader>{totalMembers}</Header.Subheader>
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
