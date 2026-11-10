import { Emitter } from '../utils/tiny-emitter.js';

export const emitter = new Emitter();
export const APP_VERSION_EVENT_ID = 'app-version-event';

const readHeader = (headers, key) => {
  if (!headers) return undefined;
  // fetch Response / axios v1 AxiosHeaders
  if (typeof headers.get === 'function') return headers.get(key);
  // plain object (axios v0, XHR wrappers): header names are case-insensitive
  const lower = key.toLowerCase();
  const match = Object.keys(headers).find((k) => k.toLowerCase() === lower);
  return match ? headers[match] : undefined;
};

/**
 * Not a React hook: call it from a fetch/axios response handler.
 * Emits the version found in the response header so `useVersion` consumers update.
 */
const useVersionTracker = (response, headerKey) => {
  const version = readHeader(response && response.headers, headerKey || 'x-version');
  if (version) {
    emitter.emit(APP_VERSION_EVENT_ID, { version: String(version) });
  }
};

export default useVersionTracker;
