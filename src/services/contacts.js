import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw new Error('Error fetching contacts: ' + error.message);
  }
};

export const getContactById = async (contactId) => {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    throw new Error('Error fetching contact by ID: ' + error.message);
  }
};
