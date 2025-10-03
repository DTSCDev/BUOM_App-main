
// Helper function to format employment type for display
export const formatEmploymentType = (employmentType: string | null | undefined) => {
  if (!employmentType) return "Not specified";
  
  switch (employmentType) {
    case 'paye_employee':
      return 'PAYE Employee';
    case 'self_employed':
      return 'Self Employed';
    case 'business_owner':
      return 'Business Owner';
    default:
      return "Not specified";
  }
};
