/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint array-callback-return: ["off"] */
const routerToUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

routerToUsers.get('/users',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),
  getUsers);

routerToUsers.get('/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),
  getUserById);

routerToUsers.patch('/users/me',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2),
    }),
  }),

  updateUserProfile);

routerToUsers.patch('/users/me/avatar',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string().regex(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/).required(),
    }),
  }),

  updateUserAvatar);

module.exports = routerToUsers;
