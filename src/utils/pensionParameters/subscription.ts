
// Function to check if user has subscription
export const hasActiveSubscription = (): boolean => {
  // In development, default to active to preview premium features
  // This does not affect production builds
  try {
    // Vite exposes DEV flag via import.meta.env.DEV (properly typed)
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;
    if (isDev) return true;

    // Check localStorage for premium subscription in non-dev environments
    const premiumStatus = typeof window !== 'undefined'
      ? window.localStorage.getItem('premiumSubscription')
      : null;

    // Only return true if explicitly set to 'active'
    return premiumStatus === 'active';
  } catch {
    // Safe fallback: treat as not subscribed
    return false;
  }
};
