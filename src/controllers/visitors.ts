import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createVisitorSchema } from '../validators/visitors';

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
    const result = createVisitorSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { name, hostResidentId, phone, purpose } = result.data;

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
export async function checkOutVisitor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid visitor id' });
    }

    const visitor = await prisma.visitor.findUnique({ where: { id } });
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    if (visitor.checkOutTime) {
      return res.status(409).json({ error: 'Visitor already checked out' });
    }

    const updated = await prisma.visitor.update({
      where: { id },
      data: { checkOutTime: new Date() },
      include: {
        hostResident: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check out visitor' });
  }
}
