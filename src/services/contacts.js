import { Contact } from '../models/contact.js';

export const getAllContactsService = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  try {
    const contacts = await Contact.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const totalItems = await Contact.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / perPage);

    return { contacts, totalItems, totalPages };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Error fetching contacts');
  }
};

export const getContactByIdService = async (id) => {
  return await Contact.findById(id);
};

export const createContactService = async (data) => {
  return await Contact.create(data);
};

export const updateContactService = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContactService = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
