import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string({ error: 'email is required' }).email('Invalid email'),
    password: z.string({ error: 'password is required' }).min(1, 'password is required')
});