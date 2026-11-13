import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apartmentRoutes from './routes/apartments';
import userRoutes from './routes/users';
import residentRoutes from './routes/residents';
import visitorRoutes from './routes/visitors';
import maintenanceRequestRoutes from './routes/maintenanceRequests';
import announcementRoutes from './routes/announcements';
import authRoutes from './routes/auth';
import { authenticate } from './middleware/auth';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Estate Management API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/apartments', authenticate, apartmentRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/residents', authenticate, residentRoutes);
app.use('/api/visitors', authenticate, visitorRoutes);
app.use('/api/maintenance-requests', authenticate, maintenanceRequestRoutes);
app.use('/api/announcements', authenticate, announcementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
