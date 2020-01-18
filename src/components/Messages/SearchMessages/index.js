import React, { useEffect, useRef } from "react";
import { Segment, Button, Input } from "semantic-ui-react";

const useFocusInput = (shouldFocus, ref) => {
  useEffect(() => {
    if (shouldFocus && ref) {
      ref.current.focus();
    }
  }, [ref, shouldFocus]);
};

const SearchMessages = ({
  isSearching,
  isVisible,
  handleExit,
  onChange,
  value
}) => {
  const inputRef = useRef();
  useFocusInput(isVisible, inputRef);

  return (
    <Segment>
      <Input
        ref={inputRef}
        onChange={onChange}
        fluid
        label={<Button icon="arrow left" onClick={handleExit} />}
        labelPosition="left"
        loading={isSearching}
        name="message"
        placeholder="Search messages..."
      />
    </Segment>
  );
};

export default SearchMessages;
