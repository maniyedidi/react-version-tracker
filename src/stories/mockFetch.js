// Replaces window.fetch so stories work offline. Restores it on cleanup.
export const mockVersionFetch = ({ version, fail = false, delay = 0 } = {}) => {
  const original = window.fetch;
  window.fetch = async () => {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    if (fail) throw new Error('Network error');
    return { ok: true, json: async () => ({ version }) };
  };
  return () => {
    window.fetch = original;
  };
};
