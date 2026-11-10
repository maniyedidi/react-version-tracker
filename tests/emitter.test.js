import { Emitter } from '../src/utils/tiny-emitter.js';

describe('Emitter', () => {
  it('calls listeners and supports off', () => {
    const e = new Emitter();
    const fn = vi.fn();
    e.on('a', fn).emit('a', 1, 2);
    expect(fn).toHaveBeenCalledWith(1, 2);
    e.off('a', fn).emit('a');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('once fires a single time', () => {
    const e = new Emitter();
    const fn = vi.fn();
    e.once('a', fn);
    e.emit('a');
    e.emit('a');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('event names that match method names do not collide', () => {
    const e = new Emitter();
    const fn = vi.fn();
    e.on('emit', fn).on('on', fn).emit('emit').emit('on');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('allows unsubscribing during emit', () => {
    const e = new Emitter();
    const second = vi.fn();
    const first = () => e.off('a', first);
    e.on('a', first).on('a', second);
    e.emit('a');
    expect(second).toHaveBeenCalledTimes(1);
  });
});
