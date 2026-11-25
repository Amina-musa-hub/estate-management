import { z } from 'zod';

export const createMaintenanceRequestSchema = z.object({
  title: z.string({ error: 'title is required' }).min(1, 'title is required'),
  description: z.string({ error: 'description is required' }).min(1, 'description is required'),
  submittedById: z.number({ error: 'submittedById is required' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export const updateMaintenanceRequestSchema = z
  .object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).optional(),
    assignedToId: z.number({ error: 'assignedToId must be a number' }).optional(),
  })
  .refine((data) => data.status !== undefined || data.assignedToId !== undefined, {
    message: 'Provide status or assignedToId',
  });
