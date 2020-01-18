import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = () => {
  return (
    <Dimmer active inverted>
      <Loader size="huge" content="Loading..." />
    </Dimmer>
  );
};

export default Spinner;
