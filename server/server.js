require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database/database');
const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipments');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

try {
  initializeDatabase();
  console.log('Database ready.');
} catch (error) {
  console.error('Failed to initialize database:', error.message);
  process.exit(1);
}

app.use('/api/auth', authRoutes);
app.use('/api/shipments', authMiddleware, shipmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
