import express from 'express';
import { connectToDatabase } from './config/db.config.js';
import router from './routes/auth.routes.js';

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/api/auth', router)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
})