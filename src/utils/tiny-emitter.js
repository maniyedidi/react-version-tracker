export class Emitter {
  constructor() {
    this._events = new Map();
  }

  emit(event, ...args) {
    if (!event) return this;
    const listeners = this._events.get(event);
    if (!listeners) return this;
    // iterate over a copy so listeners can unsubscribe while emitting
    for (const entry of [...listeners]) {
      if (entry.once) this.off(event, entry.fn);
      entry.fn.apply(entry.ctx, args);
    }
    return this;
  }

  on(event, fn, ctx, once = false) {
    if (!event || typeof fn !== 'function') return this;
    if (!this._events.has(event)) this._events.set(event, []);
    this._events.get(event).push({ fn, ctx, once });
    return this;
  }

  once(event, fn, ctx) {
    return this.on(event, fn, ctx, true);
  }

  off(event, fn) {
    if (!event) return this;
    if (!fn) {
      this._events.delete(event);
      return this;
    }
    const listeners = this._events.get(event);
    if (!listeners) return this;
    const remaining = listeners.filter((entry) => entry.fn !== fn);
    if (remaining.length) this._events.set(event, remaining);
    else this._events.delete(event);
    return this;
  }
}
