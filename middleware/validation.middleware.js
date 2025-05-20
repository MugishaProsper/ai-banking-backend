import Joi from 'joi';
import AppError from '../utils/AppError.js';

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    fullNames: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr').default('en'),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    fullNames: Joi.string(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr'),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    })
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    password: Joi.string().min(8).required()
  }),

  kycUpload: Joi.object({
    documentType: Joi.string().valid('passport', 'id_card', 'drivers_license').required(),
    documentNumber: Joi.string().required()
  })
};

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }));

      return next(new AppError('Invalid input data', 400, errors));
    }

    next();
  };
}; 