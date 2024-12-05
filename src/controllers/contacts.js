import createError from 'http-errors';
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    let {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    page = Math.max(Number(page), 1);
    perPage = Math.max(Number(perPage), 1);

    if (isNaN(page) || isNaN(perPage)) {
      throw createError(400, 'Page and perPage must be valid numbers');
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      throw createError(400, 'sortOrder must be "asc" or "desc"');
    }

    const filters = {};

    if (type) filters.contactType = type;
    if (isFavourite !== undefined) {
      if (isFavourite !== 'true' && isFavourite !== 'false') {
        throw createError(400, 'isFavourite must be "true" or "false"');
      }
      filters.isFavourite = isFavourite === 'true';
    }

    const { contacts, totalItems, totalPages } = await getAllContactsService({
      page,
      perPage,
      sortBy,
      sortOrder,
      filters,
    });

    if (!contacts || contacts.length === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No contacts found.',
        data: {
          data: [],
          page,
          perPage,
          totalItems: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError(400, 'Invalid contact ID format');
    }

    const contact = await getContactByIdService(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      throw createError(400, 'Name, email, and phone are required');
    }

    const newContact = await createContactService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError(400, 'Invalid contact ID format');
    }

    const updatedContact = await updateContactService(contactId, req.body);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError(400, 'Invalid contact ID format');
    }

    const deletedContact = await deleteContactService(contactId);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
