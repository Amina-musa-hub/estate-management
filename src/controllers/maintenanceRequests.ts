import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getAllMaintenanceRequests(req: Request, res: Response) {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      include: {
        submittedBy: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch maintenance requests' });
  }
}

export async function createMaintenanceRequest(req: Request, res: Response) {
  try {
    const { title, description, submittedById, priority } = req.body;

    if (!title || !description || !submittedById) {
      return res.status(400).json({ error: 'title, description, and submittedById are required' });
    }

    if (!(await prisma.resident.findUnique({ where: { id: submittedById } }))) {
      return res.status(404).json({ error: 'Resident with submittedById not found' });
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        submittedById,
        ...(priority && { priority }),
      },
      include: {
        submittedBy: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create maintenance request' });
  }
}