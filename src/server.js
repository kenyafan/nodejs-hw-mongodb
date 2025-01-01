import * as fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transport = pino.transport({
  target: 'pino-pretty',
  options: { translateTime: 'SYS:standard', ignore: 'pid,hostname' },
});
const logger = pinoHttp({ logger: pino(transport) });

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
);

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(errorHandler);

export const setupServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
