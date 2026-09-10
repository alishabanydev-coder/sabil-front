let ignoreNavbarBackUntil = 0;

export function suppressWatchNavbarBack(ms = 800) {
  ignoreNavbarBackUntil = Date.now() + ms;
}

export function shouldIgnoreWatchNavbarBack() {
  return Date.now() < ignoreNavbarBackUntil;
}
