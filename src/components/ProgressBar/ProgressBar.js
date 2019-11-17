import React, { useState, useEffect } from "react";
import { Progress } from "semantic-ui-react";
import { createUseStyles } from "react-jss";

const useStyle = createUseStyles({
  progress__bar: {
    ".ui&:last-child": {
      margin: "0.3em 0 0 0"
    }
  }
});

const ProgressBar = ({ uploadState, percentUploaded }) => {
  const [show, setShow] = useState(false);
  const styles = useStyle();

  useEffect(() => {
    if (uploadState === "uploading") {
      setShow(true);
    } else if (uploadState === "done") {
      setTimeout(() => setShow(false), 3000);
    } else {
      setShow(false);
    }
  }, [uploadState]);

  return (
    show && (
      <Progress
        className={styles.progress__bar}
        percent={percentUploaded}
        progress
        indicating
        size="medium"
        inverted
      />
    )
  );
};

export default ProgressBar;
