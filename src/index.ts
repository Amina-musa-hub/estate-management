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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Estate Management API is running' });
});

app.use('/api/apartments', apartmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/maintenance-requests', maintenanceRequestRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});