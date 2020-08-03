const card = require('../models/card');
const NotFoundError = require('../midllewares/errors/errorHandler');
const BadRequest = require('../midllewares/errors/errorHandler');
const Forbidden = require('../midllewares/errors/errorHandler');

module.exports.getCards = (req, res, next) => {
  card.find({})
    .then(
      (cards) => {
        if ((!cards) || (cards.length === 0)) {
          throw new NotFoundError('Нет карточек для отображения');
        }
        res.send({ data: cards });
      },
    )
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const userId = req.user._id;
  if (!req.body) {
    throw new BadRequest('Ни одно из вводимых полей не может быть пустым');
  }
  card.create({ name, link, owner: userId })
    // eslint-disable-next-line no-shadow
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { id } = req.params;
  if (!req.params) {
    throw new BadRequest('Ни одно из вводимых полей не может быть пустым');
  }
  // eslint-disable-next-line no-underscore-dangle,consistent-return
  card.findOneAndDelete({ _id: id, owner: req.user._id })
    .then((result) => {
      if ((!result) || (result.length === 0)) {
        throw new BadRequest(`Картинка ${id} не существует`);
      }
      // eslint-disable-next-line no-underscore-dangle
      if (req.user._id !== result.owner._id) {
        throw new Forbidden('Нет прав для удаления картинки');
      }
      res.send({ message: 'Картинка успешно удалена' });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    { _id: req.params.cardId },
    // eslint-disable-next-line no-underscore-dangle
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((obj) => {
      res.send(obj);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    { _id: req.params.cardId },
    // eslint-disable-next-line no-underscore-dangle
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((obj) => {
      res.send(obj);
    })
    .catch(next);
};
