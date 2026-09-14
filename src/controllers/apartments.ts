import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getAllApartments(req: Request, res: Response) {
  try {
    const apartments = await prisma.apartment.findMany();
    res.json(apartments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch apartments' });
  }
}

export async function createApartment(req: Request, res: Response) {
  try {
    const { unitNumber, block, status } = req.body;

    if (!unitNumber) {
      return res.status(400).json({ error: 'unitNumber is required' });
    }

    const apartment = await prisma.apartment.create({
      data: { unitNumber, block, status },
    });

    res.status(201).json(apartment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create apartment' });
  }
}