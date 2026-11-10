import { useEffect, useState } from 'react';
import { APP_VERSION_EVENT_ID, emitter } from './useVersionTracker.js';

const useVersion = () => {
  const [versionDetails, setVersionDetails] = useState({});

  useEffect(() => {
    const onVersion = (details) => {
      if (!details) return;
      setVersionDetails((prev) =>
        prev.version === details.version ? prev : details
      );
    };
    emitter.on(APP_VERSION_EVENT_ID, onVersion);
    return () => {
      emitter.off(APP_VERSION_EVENT_ID, onVersion);
    };
  }, []);

  return versionDetails;
};

export default useVersion;
