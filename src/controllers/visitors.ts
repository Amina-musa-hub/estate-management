import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getAllVisitors(req: Request, res: Response) {
  try {
    const visitors = await prisma.visitor.findMany({
      include: {
        hostResident: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
    res.json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
}

export async function createVisitor(req: Request, res: Response) {
  try {
    const { name, hostResidentId, phone, purpose } = req.body;

   if(!name || !hostResidentId) {
      return res.status(400).json({ error: 'name and hostResidentId are required' });
    }
   
    const resident = await prisma.resident.findUnique({ where: { id: hostResidentId } });
    if (!resident) {
      return res.status(404).json({ error: 'Host resident not found' });
    }

    const visitor = await prisma.visitor.create({
      data: { name, hostResidentId, phone, purpose },
      include: {
        hostResident: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    res.status(201).json(visitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create visitor' });
  }
}       