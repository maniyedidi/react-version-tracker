import React, { useEffect } from 'react';

const getJSON = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

const VersionTracker = ({
  currentVersion,
  versionFileUrl = '/version.json',
  interval = 60,
  onVersionChange,
  displayAlert,
  message,
}) => {
  useEffect(() => {
    let intervalId = setInterval(() => {
      inti();
    }, [interval * 1000]);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const inti = () => {
    getJSON(versionFileUrl, function (err, data) {
      if (err !== null) {
      } else {
        const remoteVersion = data.version;
        if (currentVersion !== remoteVersion) {
          onVersionChange({
            version: remoteVersion,
          });
          if (displayAlert) {
            alert(
              message || 'There is a version change, Please do hard refresh'
            );
          }
        }
      }
    });
  };
  
  return null;
};

export default VersionTracker;
