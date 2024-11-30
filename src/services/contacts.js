import { Contact } from '../models/contact.js';
import createError from 'http-errors';

export const getAllContactsService = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw createError(500, `Error fetching contacts: ${error.message}`);
  }
};

export const getContactByIdService = async (id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    return contact;
  } catch (error) {
    if (error.name === 'CastError') {
      throw createError(400, 'Invalid contact ID');
    }
    throw createError(500, `Error fetching contact by ID: ${error.message}`);
  }
};

export const createContactService = async (data) => {
  try {
    return await Contact.create(data);
  } catch (error) {
    throw createError(500, `Error creating contact: ${error.message}`);
  }
};

export const updateContactService = async (id, data) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    return updatedContact;
  } catch (error) {
    if (error.name === 'CastError') {
      throw createError(400, 'Invalid contact ID');
    }
    throw createError(500, `Error updating contact: ${error.message}`);
  }
};

export const deleteContactService = async (id) => {
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    return true;
  } catch (error) {
    if (error.name === 'CastError') {
      throw createError(400, 'Invalid contact ID');
    }
    throw createError(500, `Error deleting contact: ${error.message}`);
  }
};
