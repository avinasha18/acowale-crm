import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  category: z.enum(["PRODUCT", "FEATURE_REQUEST", "UI_UX", "SUPPORT", "BILLING", "OTHER"]),
  message: z.string().min(10, "Feedback must be at least 10 characters").max(1000),
  rating: z.number().min(1).max(5).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
