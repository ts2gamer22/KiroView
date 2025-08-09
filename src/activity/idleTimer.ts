export type IdleTimer = {
  markActive: () => void;
  onIdle: (cb: () => void) => void;
  onActive: (cb: () => void) => void;
  dispose: () => void;
};

export const createIdleTimer = (timeoutMs: number): IdleTimer => {
  let lastActive = Date.now();
  let timer: NodeJS.Timeout | null = null;
  const idleListeners: Array<() => void> = [];
  const activeListeners: Array<() => void> = [];
  let isIdle = false;

  const schedule = () => {
    timer?.unref?.();
    timer && clearTimeout(timer);
    const delay = Math.max(0, timeoutMs - (Date.now() - lastActive));
    timer = setTimeout(() => {
      if (!isIdle) {
        isIdle = true;
        idleListeners.forEach((f) => f());
      }
    }, delay);
  };

  const markActive = () => {
    lastActive = Date.now();
    if (isIdle) {
      isIdle = false;
      activeListeners.forEach((f) => f());
    }
    schedule();
  };

  // start
  schedule();

  return {
    markActive,
    onIdle: (cb) => void idleListeners.push(cb),
    onActive: (cb) => void activeListeners.push(cb),
    dispose: () => timer && clearTimeout(timer),
  };
};


