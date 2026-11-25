import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'title is required'),
  body: z.string().min(1, 'body is required'),
  postedById: z.number({ error: 'postedById is required' }),
  audience: z
    .enum([ 'ADMIN', 'RESIDENT', 'SECURITY', 'MAINTENANCE'])
    .optional(),
});
