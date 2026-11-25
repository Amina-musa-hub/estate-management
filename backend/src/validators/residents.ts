import { z } from 'zod';

export const createResidentSchema = z.object({
  userId: z.number({ error: 'userId is required' }),
  apartmentId: z.number({ error: 'apartmentId is required' }),
  phone: z.string().optional(),
});
