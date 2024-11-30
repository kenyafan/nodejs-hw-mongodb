import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import contactsRouter from './routers/contacts.js';

const transport = pino.transport({
  target: 'pino-pretty',
  options: { translateTime: 'SYS:standard', ignore: 'pid,hostname' },
});
const logger = pinoHttp({ logger: pino(transport) });

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/contacts', contactsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export const setupServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
