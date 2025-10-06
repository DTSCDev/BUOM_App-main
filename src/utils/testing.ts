export function isTestingAccount(): boolean {
  // Centralized toggle for testing overrides. Adjust logic as needed.
  // Strategy:
  // - Check explicit env var
  // - Fallback to localStorage flag for runtime toggling
  // - Fallback to hostname pattern commonly used in testing
  try {
    const envFlag = (process.env?.TESTING_ACCOUNT ?? process.env?.VITE_TESTING_ACCOUNT)?.toString();
    if (envFlag && envFlag.toLowerCase() === 'true') return true;
  } catch (e) { void e; }

  try {
    const ls = typeof window !== 'undefined' ? window.localStorage.getItem('TESTING_ACCOUNT') : null;
    if (ls && ls.toLowerCase() === 'true') return true;
  } catch (e) { void e; }

  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    if (host.includes('localhost') || host.includes('127.0.0.1')) return true;
  } catch (e) { void e; }

  return false;
}

export function testingOverride<T>(value: T, override: T): T {
  return isTestingAccount() ? override : value;
}