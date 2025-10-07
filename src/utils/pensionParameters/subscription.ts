
// Function to check if user has subscription
export const hasActiveSubscription = (): boolean => {
  // Until server validation is implemented, treat signed-in users as subscribed.
  // This enables premium features consistently across environments.
  return true;
};
