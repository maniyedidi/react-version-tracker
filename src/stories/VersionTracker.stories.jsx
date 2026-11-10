import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';
import { VersionTracker } from '../index.js';
import { mockVersionFetch } from './mockFetch.js';

// Installs the fetch mock before the story renders.
const withMockedFetch = (Story, { parameters }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const restore = mockVersionFetch(parameters.remote);
    setReady(true);
    return restore;
  }, [parameters.remote]);
  return ready ? <Story /> : null;
};

const Status = ({ children }) => (
  <p style={{ fontFamily: 'sans-serif' }}>{children}</p>
);

const Harness = ({ currentVersion, ...props }) => {
  const [detected, setDetected] = useState(null);
  return (
    <>
      <VersionTracker
        currentVersion={currentVersion}
        {...props}
        onVersionChange={(v) => {
          setDetected(v.version);
          props.onVersionChange?.(v);
        }}
      />
      <Status>Running version: <b>{currentVersion}</b></Status>
      <Status>
        {detected ? <>New version detected: <b>{detected}</b></> : 'No version change detected'}
      </Status>
    </>
  );
};

export default {
  title: 'VersionTracker',
  component: VersionTracker,
  render: (args) => <Harness {...args} />,
  decorators: [withMockedFetch],
  args: {
    currentVersion: '1.0.0',
    versionFileUrl: '/version.json',
    interval: 5,
    displayAlert: false,
    onVersionChange: fn(),
  },
  argTypes: {
    onVersionChange: { action: 'onVersionChange' },
  },
};

export const NoVersionChange = { parameters: { remote: { version: '1.0.0' } } };

export const VersionChanged = { parameters: { remote: { version: '1.1.0' } } };

export const AlertWithDefaultMessage = {
  args: { displayAlert: true },
  parameters: { remote: { version: '2.0.0' } },
};

export const AlertWithCustomMessage = {
  args: { displayAlert: true, message: 'A new release is available. Please refresh.' },
  parameters: { remote: { version: '2.0.0' } },
};

export const CustomUrlAndInterval = {
  args: { versionFileUrl: 'https://example.com/api/get-version', interval: 2 },
  parameters: { remote: { version: '1.2.0' } },
};

export const NetworkFailureIsIgnored = {
  parameters: { remote: { fail: true } },
};
