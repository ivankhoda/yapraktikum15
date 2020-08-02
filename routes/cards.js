const routerToCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerToCards.get('/cards',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),

  getCards);

routerToCards.post('/cards',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2),
    }),
  }),

  createCard);

routerToCards.delete('/cards/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),

  deleteCardById);

routerToCards.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
  }),

  likeCard);

routerToCards.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24),
    }),
  }),

  dislikeCard);

module.exports = routerToCards;
