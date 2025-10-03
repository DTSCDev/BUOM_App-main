
// Function to check if user has subscription
export const hasActiveSubscription = (): boolean => {
  // For free calculator, always return false unless explicitly set
  // This ensures free users see the FreePensionCharts component
  
  // Check localStorage for premium subscription
  const premiumStatus = localStorage.getItem('premiumSubscription');
  
  // Only return true if explicitly set to 'active'
  return premiumStatus === 'active';
};
