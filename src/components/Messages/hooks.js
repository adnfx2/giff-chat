import { useState, useEffect, useRef } from "react";

// HELPERS

let prevTimeout = null;

const createTimeout = (handler, ms) => {
  if (prevTimeout) {
    clearTimeout(prevTimeout);
  }
  prevTimeout = setTimeout(handler, ms);
};

const filterMessages = (messages, searchTerm) => {
  const regex = new RegExp(searchTerm, "gi");
  const filteredMessages = messages.reduce((acc, message) => {
    if (
      (message.content && message.content.match(regex)) ||
      message.user.name.match(regex)
    ) {
      acc.push(message);
    }
    return acc;
  }, []);
  return filteredMessages;
};

// HOOKS

export const useSearchMessages = (messages, searchTerm) => {
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (messages && messages.length > 0 && searchTerm) {
      setIsSearching(true);
      const filteredMessages = filterMessages(messages, searchTerm);
      createTimeout(() => {
        setIsSearching(false);
        setSearchResult(filteredMessages);
      }, 1000);
    } else {
      setIsSearching(false);
      setSearchResult(null);
    }
  }, [messages, searchTerm]);
  return [isSearching, searchResult];
};

export const useScrollToView = (shouldScroll, behavior) => {
  const viewRef = useRef(null);

  useEffect(() => {
    if (shouldScroll) {
      viewRef.current.scrollIntoView({ behavior });
    }
  }, [behavior, shouldScroll]);

  return viewRef;
};
