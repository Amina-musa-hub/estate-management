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
import { updateMaintenanceRequestSchema } from '../validators/maintenanceRequests';

export async function updateMaintenanceRequest(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid request id' });
    }

    const result = updateMaintenanceRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { status, assignedToId } = result.data;

    const existing = await prisma.maintenanceRequest.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    if (assignedToId !== undefined) {
      const staff = await prisma.user.findUnique({ where: { id: assignedToId } });
      if (!staff || staff.role !== 'MAINTENANCE') {
        return res.status(400).json({ error: 'assignedToId must be a MAINTENANCE user' });
      }
    }

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(assignedToId !== undefined && { assignedToId }),
      },
      include: {
        submittedBy: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update maintenance request' });
  }
}
