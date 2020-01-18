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

const ProgressBar = ({ isUploading, percentUploaded }) => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(percentUploaded);
  const styles = useStyle();

  useEffect(() => {
    const shouldShowProgress = state => {
      setShow(state);
      setProgress(percentUploaded);
    };
    if (isUploading) {
      shouldShowProgress(true);
    } else if (show) {
      setTimeout(() => {
        shouldShowProgress(false);
      }, 2000);
    }
  }, [isUploading, percentUploaded]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    show && (
      <Progress
        className={styles.progress__bar}
        percent={progress}
        progress
        indicating
        size="medium"
        inverted
      />
    )
  );
};

export default ProgressBar;
