import { useEffect, useRef } from 'react';

const DEFAULT_MESSAGE = 'There is a version change, Please do hard refresh';

const VersionTracker = ({
  currentVersion,
  versionFileUrl = '/version.json',
  interval = 60,
  onVersionChange,
  displayAlert,
  message,
}) => {
  // always read the latest props from inside the long-lived interval
  const latest = useRef({});
  latest.current = { currentVersion, onVersionChange, displayAlert, message };
  const notifiedVersion = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(versionFileUrl, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data || data.version === undefined) return;
        const remoteVersion = data.version;
        const props = latest.current;
        if (
          remoteVersion !== props.currentVersion &&
          remoteVersion !== notifiedVersion.current
        ) {
          notifiedVersion.current = remoteVersion;
          if (typeof props.onVersionChange === 'function') {
            props.onVersionChange({ version: remoteVersion });
          }
          if (props.displayAlert) {
            alert(props.message || DEFAULT_MESSAGE);
          }
        }
      } catch (e) {
        // network/parse errors are ignored; the next tick retries
      }
    };

    check();
    const id = setInterval(check, interval * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [versionFileUrl, interval]);

  return null;
};

export default VersionTracker;
