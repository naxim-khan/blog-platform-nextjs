import { z } from "zod";

// - Schema for adding a comment
export const commentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment too long"),
  userId: z.string().optional(), // if logged-in user adds comment
  authorName: z.string().optional(), // for guest comments
  authorEmail: z.string().email().optional(),
});
