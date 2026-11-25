import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'password is required'),
  role: z.string().min(1, 'role is required'),
});