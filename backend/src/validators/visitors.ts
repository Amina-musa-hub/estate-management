import { z } from 'zod';

export const createVisitorSchema = z.object({
  name: z.string().min(1, 'name is required'),
  hostResidentId: z.number({ error: 'hostResidentId is required' }),
  phone: z.string().optional(),
  purpose: z.string().optional(),
});
