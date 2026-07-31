const express = require('express');
const cors = require('cors');

const requestLogger = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const healthRoutes = require('./routes/healthRoutes');
const envRoutes = require('./routes/envRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'MongoDB DevOps Demo API is running' });
});

app.use('/health', healthRoutes);
app.use('/env', envRoutes);
app.use('/users', userRoutes);
app.use('/logs', logRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
