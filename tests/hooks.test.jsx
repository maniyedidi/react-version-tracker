import { renderHook, act } from '@testing-library/react';
import { useVersion, useVersionTracker } from '../src/index.js';
import { emitter, APP_VERSION_EVENT_ID } from '../src/hooks/useVersionTracker.js';

describe('useVersionTracker', () => {
  it('reads from fetch-style Headers', () => {
    const { result } = renderHook(() => useVersion());
    act(() => {
      useVersionTracker({ headers: new Headers({ 'x-version': '2.0.0' }) });
    });
    expect(result.current).toEqual({ version: '2.0.0' });
  });

  it('reads custom, case-insensitive keys from plain-object headers', () => {
    const { result } = renderHook(() => useVersion());
    act(() => {
      useVersionTracker({ headers: { 'X-App-Version': '3' } }, 'x-app-version');
    });
    expect(result.current).toEqual({ version: '3' });
  });

  it('ignores responses without headers or version', () => {
    const { result } = renderHook(() => useVersion());
    act(() => {
      useVersionTracker({});
      useVersionTracker(undefined);
      useVersionTracker({ headers: {} });
    });
    expect(result.current).toEqual({});
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useVersion());
    unmount();
    expect(emitter._events.get(APP_VERSION_EVENT_ID)).toBeUndefined();
  });
});
