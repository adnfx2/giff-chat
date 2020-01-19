import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const styles = {
  message: {
    borderLeft: "2px solid orange",
    paddingLeft: 8,
    color: "red"
  },
  message__image: {
    padding: "1em"
  }
};

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, currentUser }) => {
  const isOwnMessage = message.user.id === currentUser.uid;

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content style={isOwnMessage ? styles.message : {}}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        {//prettier-ignore
        message.image
         ? <Image src={message.image} style={styles.message__image}/>
         : message.content
          ? <Comment.Text>{message.content}</Comment.Text> 
          : 'something went wrong!'}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
