import { useState } from 'react';
import { useVersion, useVersionTracker } from '../index.js';

const Display = ({ currentVersion }) => {
  const { version } = useVersion();
  const changed = version && version !== currentVersion;
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <p>Running version: <b>{currentVersion}</b></p>
      <p>
        Latest from API headers: <b>{version || 'none yet'}</b>
        {changed && ' - new version available, please refresh'}
      </p>
    </div>
  );
};

const Demo = ({ currentVersion, makeResponse, headerKey, label }) => {
  const [calls, setCalls] = useState(0);
  return (
    <>
      <Display currentVersion={currentVersion} />
      <button
        onClick={() => {
          // This is what you would call from a fetch .then() or axios interceptor.
          useVersionTracker(makeResponse(), headerKey);
          setCalls((c) => c + 1);
        }}
      >
        {label} (calls: {calls})
      </button>
    </>
  );
};

export default {
  title: 'Hooks/useVersion + useVersionTracker',
  args: { currentVersion: '1.0.0' },
};

export const FetchStyleHeaders = {
  render: (args) => (
    <Demo
      {...args}
      label="Simulate fetch response with x-version: 1.1.0"
      makeResponse={() => ({ headers: new Headers({ 'x-version': '1.1.0' }) })}
    />
  ),
};

export const AxiosStylePlainHeaders = {
  render: (args) => (
    <Demo
      {...args}
      label="Simulate axios response with x-version: 1.2.0"
      makeResponse={() => ({ headers: { 'x-version': '1.2.0' } })}
    />
  ),
};

export const CustomHeaderKey = {
  render: (args) => (
    <Demo
      {...args}
      headerKey="X-App-Build"
      label="Simulate response with X-App-Build: 3.0.0"
      makeResponse={() => ({ headers: new Headers({ 'X-App-Build': '3.0.0' }) })}
    />
  ),
};

export const ResponseWithoutVersionHeader = {
  render: (args) => (
    <Demo
      {...args}
      label="Simulate response without a version header"
      makeResponse={() => ({ headers: new Headers() })}
    />
  ),
};
