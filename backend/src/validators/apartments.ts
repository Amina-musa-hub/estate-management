import { z } from 'zod';

export const createApartmentSchema = z.object({
  unitNumber: z.string().min(1, 'unitNumber is required'),
  block: z.string().optional(),
  status: z.string().optional(),
});