import cors from 'cors';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import 'dotenv/config';
import { getAllContacts, getContactById } from './services/contacts.js';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  },
});

const logger = pinoHttp({
  logger: pino(transport),
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send({ status: 500, message: 'Internal server error' });
});

app.get('/', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    logger.logger.error(error);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch contacts',
    });
  }
});

app.get('/contacts/:contactId', async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    logger.logger.error(error);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch contact',
    });
  }
});

export function setupServer() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
