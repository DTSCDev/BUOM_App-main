
import { z } from 'zod';

// Define the form schema with validation
export const formSchema = z.object({
  accountType: z.string().min(1, { message: "Please select an account type" }),
  interests: z.array(z.string()).refine(data => data.length > 0, {
    message: "Please select at least one area of interest"
  })
});

export type FormValues = z.infer<typeof formSchema>;
