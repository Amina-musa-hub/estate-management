import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createResidentSchema } from '../validators/residents';

export async function getAllResidents(req: Request, res: Response) {
  try {
    const residents = await prisma.resident.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        apartment: true,
      },
    });
    res.json(residents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch residents' });
  }
}

export async function createResident(req: Request, res: Response) {
  try {
    const result = createResidentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { userId, apartmentId, phone } = result.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const apartment = await prisma.apartment.findUnique({ where: { id: apartmentId } });
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    const existing = await prisma.resident.findUnique({ where: { userId } });
    if (existing) {
      return res.status(409).json({ error: 'This user is already a resident' });
    }

    const resident = await prisma.resident.create({
      data: { userId, apartmentId, phone },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        apartment: true,
      },
    });

    res.status(201).json(resident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create resident' });
  }
}
