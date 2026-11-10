import { z } from 'zod';

export const createMaintenanceRequestSchema = z.object({
  title:z.string({ error: 'title is required' }).min(1, 'title is required'), 
  submittedById: z.number({ error: 'submittedById is required' }),
  description: z.string({ error: 'description is required' }).min(1, 'description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});