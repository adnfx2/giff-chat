import React, { useEffect, useRef } from "react";
import { Segment, Button, Input, Icon } from "semantic-ui-react";

const useFocusInput = (shouldFocus, ref) => {
  useEffect(() => {
    console.log({ ref });
    if (shouldFocus && ref) {
      ref.current.focus();
    }
  }, [ref, shouldFocus]);
};

const SearchMessages = ({ isSearching, handleExitSearch }) => {
  const inputRef = useRef();
  useFocusInput(isSearching, inputRef);

  return (
    <Segment>
      <Input
        ref={inputRef}
        fluid
        label={<Button icon="arrow left" onClick={handleExitSearch} />}
        labelPosition="left"
        name="message"
        placeholder="Search messages..."
      />
    </Segment>
  );
};

export default SearchMessages;
