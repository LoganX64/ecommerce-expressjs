import app from './src/app';
import { config } from './src/config/config';
import connectDB from './src/config/db';

const startServer = async () => {
  try {
    await connectDB();
    const port = config.port;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
