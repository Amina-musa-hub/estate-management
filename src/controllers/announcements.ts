import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function getAllAnnouncements(req: Request, res: Response) {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        postedBy: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}

export async function createAnnouncement(req: Request, res: Response) {
  try {
    const { title, body, postedById, audience } = req.body;

    // TODO 1: validate that `title`, `body`, and `postedById` exist
      if(!title || !body || !postedById ) {
        return res.status(400).json({ error: 'title, body, and postedById are required' });
      }

    // TODO 2: check that a User with id `postedById` actually exists
    // (reuse prisma.user.findUnique — same pattern as checking residents/users before)
    ()

    // TODO 3: create the announcement using prisma.announcement.create
    // data: title, body, postedById, and only include `audience` if it was provided
    // (same conditional-spread trick you used for priority)
    // include: postedBy, same shape as getAll above
    // don't forget res.status(201).json(...)


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
}