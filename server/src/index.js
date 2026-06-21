import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { errorMeddleware } from './middlewares/error.meddleware.js';

config();
const app = express();
const port = process.env.PORT;
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

// console.log(process.env.CREATIVEPROMPT)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/', apiRoutes);

app.use(errorMeddleware);

// Vercel serverless: export app instead of calling app.listen()
export default app;

// Local dev fallback
if (process.env.NODE_ENV !== 'production') {
  app.listen(port || 5000, () => {
    console.log(`Server is running on port ${port || 5000}`);
  });
}