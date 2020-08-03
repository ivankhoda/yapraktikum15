const Card = require('../models/card');
const NotFoundError = require('../midllewares/errors/NotFoundError');
const BadRequest = require('../midllewares/errors/BadRequest');
const Forbidden = require('../midllewares/errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
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
  Card.create({ name, link, owner: userId })
    // eslint-disable-next-line no-shadow
    .then(
      (card) => { res.send({ data: card }); },
      (err) => {
        throw new BadRequest(`${err}`);
      },
    )
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { id } = req.params;
  if (!req.params) {
    throw new BadRequest('Ни одно из вводимых полей не может быть пустым');
  }
  // eslint-disable-next-line no-underscore-dangle,consistent-return
  Card.findOne({ _id: id })

    .then((result) => {
      // eslint-disable-next-line brace-style
      if ((!result) || (result.length === 0)) { throw new NotFoundError(`Картинка ${id} не существует`); }
      // eslint-disable-next-line no-underscore-dangle
      else if (req.user._id === result.owner._id.toString()) {
        Card.deleteOne({ _id: id })
          .then(() => {
            res.send({ message: 'Картинка удалена' });
          }, (err) => {
            // eslint-disable-next-line no-console
            console.log(err);
          })
          .catch(next);
        // eslint-disable-next-line no-underscore-dangle
      } else if (req.user._id !== (result.owner._id.toString())) {
        throw new Forbidden('Нет прав для удаления картинки');
      }
    })

    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    // eslint-disable-next-line no-underscore-dangle
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((obj) => {
      if (!obj) {
        throw new NotFoundError('Картинка не найдена');
      }
      res.send(obj);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    // eslint-disable-next-line no-underscore-dangle
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((obj) => {
      if (!obj) {
        throw new NotFoundError('Картинка не найдена');
      }
      res.send(obj);
    })
    .catch(next);
};
