import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300).optional(),
  featuredImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  published: z.boolean().default(false)
});

export const updatePostSchema = postSchema.partial();