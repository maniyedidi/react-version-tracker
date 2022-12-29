import { Emitter } from '../utils/tiny-emitter';

export const emitter = new Emitter();
export const APP_VERSION_EVENT_ID = 'app-version-event';

const useVersionTracker = (response, headerKey) => {
  const { headers } = response;
  if (headers.get) {
    let version = headers.get(headerKey || 'x-version');
    if (version) {
      emitter.emit(APP_VERSION_EVENT_ID, { version });
    }
  }
};

export default useVersionTracker;
