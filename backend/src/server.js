import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import quizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Quiz API is running' }));
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use(notFound, errorHandler);

const port = Number(process.env.PORT) || 5000;
connectDB()
  .then(() => app.listen(port, '0.0.0.0', () => console.log(`Quiz API listening on ${port}`)))
  .catch(err => {
    console.error(`\nQuiz API startup aborted.\n${err.message}\n`);
    process.exit(1);
  });
