import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
 import { createMaintenanceRequestSchema } from '../validators/maintenanceRequests';

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
    const result = createMaintenanceRequestSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { title, description, submittedById, priority } = result.data;

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