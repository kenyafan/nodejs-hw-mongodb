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
    const userId = req.user._id;
    const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

    const filters = { userId };
    if (type) filters.contactType = type;
    if (isFavourite !== undefined) {
      filters.isFavourite = isFavourite === 'true';
    }

    const { contacts, totalItems, totalPages } = await getAllContactsService({
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      filters,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: {
        contacts,
        page: Number(page),
        perPage: Number(perPage),
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
    const userId = req.user._id;
    const { contactId } = req.params;

    const contact = await getContactByIdService(contactId, userId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully found the contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newContact = await createContactService({ ...req.body, userId });

    res.status(201).json({
      status: 'success',
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    const updatedContact = await updateContactService(
      contactId,
      userId,
      req.body,
    );
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    const deletedContact = await deleteContactService(contactId, userId);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
