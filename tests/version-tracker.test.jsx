import { render, act } from '@testing-library/react';
import { VersionTracker } from '../src/index.js';

const mockFetch = (version) =>
  vi.fn(async () => ({ ok: true, json: async () => ({ version }) }));

const flush = () => act(async () => { await vi.advanceTimersByTimeAsync(0); });

describe('VersionTracker', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('checks immediately and does not notify when versions match', async () => {
    global.fetch = mockFetch('1.0.0');
    const onVersionChange = vi.fn();
    render(<VersionTracker currentVersion="1.0.0" onVersionChange={onVersionChange} />);
    await flush();
    expect(fetch).toHaveBeenCalledWith('/version.json', { cache: 'no-store' });
    expect(onVersionChange).not.toHaveBeenCalled();
  });

  it('notifies once per new remote version', async () => {
    global.fetch = mockFetch('2.0.0');
    const onVersionChange = vi.fn();
    render(
      <VersionTracker currentVersion="1.0.0" interval={10} onVersionChange={onVersionChange} />
    );
    await flush();
    await act(async () => { await vi.advanceTimersByTimeAsync(30000); });
    expect(fetch.mock.calls.length).toBeGreaterThan(2);
    expect(onVersionChange).toHaveBeenCalledTimes(1);
    expect(onVersionChange).toHaveBeenCalledWith({ version: '2.0.0' });
  });

  it('alerts with custom message and tolerates a missing callback', async () => {
    global.fetch = mockFetch('2.0.0');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<VersionTracker currentVersion="1.0.0" displayAlert message="Reload!" />);
    await flush();
    expect(alertSpy).toHaveBeenCalledWith('Reload!');
  });

  it('uses the latest props inside the interval', async () => {
    global.fetch = mockFetch('2.0.0');
    const onVersionChange = vi.fn();
    const { rerender } = render(
      <VersionTracker currentVersion="1.0.0" interval={10} onVersionChange={onVersionChange} />
    );
    await flush();
    rerender(<VersionTracker currentVersion="2.0.0" interval={10} onVersionChange={onVersionChange} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(10000); });
    expect(onVersionChange).toHaveBeenCalledTimes(1); // from first check only
  });

  it('ignores network errors and non-ok responses', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('down'))
      .mockResolvedValue({ ok: false });
    const onVersionChange = vi.fn();
    render(<VersionTracker currentVersion="1.0.0" interval={5} onVersionChange={onVersionChange} />);
    await flush();
    await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
    expect(onVersionChange).not.toHaveBeenCalled();
  });

  it('stops polling on unmount', async () => {
    global.fetch = mockFetch('1.0.0');
    const { unmount } = render(<VersionTracker currentVersion="1.0.0" interval={5} />);
    await flush();
    unmount();
    const calls = fetch.mock.calls.length;
    await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
    expect(fetch.mock.calls.length).toBe(calls);
  });
});
