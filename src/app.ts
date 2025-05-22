import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import globalErrorHandler from './middleware/globalErrorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configuration for production
app.use(
  cors({
    origin: process.env.FRONT_END_DOMAIN || 'http://localhost:3000', // Fallback for development
    credentials: true,
  })
);

app.use(helmet());

// Enable Morgan logging only in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (_req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Error-handling middleware (must be last)
app.use(globalErrorHandler);

export default app;
