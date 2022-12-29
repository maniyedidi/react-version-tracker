import React, { useState } from 'react';
import { APP_VERSION_EVENT_ID, emitter } from './useVersionTracker';

const useVersion = () => {
  const [versionDetails, setVerDetails] = useState({});

  const updateVersionChange = (details) => {
    if (
      versionDetails &&
      details &&
      versionDetails.version !== details.version
    ) {
      setVerDetails(versionDetails);
    }
  };

  React.useEffect(() => {
    emitter.on(APP_VERSION_EVENT_ID, updateVersionChange);
    return () => emitter.off(APP_VERSION_EVENT_ID, versionDetails);
  }, []);

  return versionDetails;
};

export default useVersion;
