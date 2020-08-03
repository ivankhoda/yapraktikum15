const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../midllewares/errors/NotFoundError');
const BadRequest = require('../midllewares/errors/BadRequest');
const NotUnique = require('../midllewares/errors/NotUnique');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then(
      (users) => {
        if ((!users) || (users.length === 0)) {
          throw new NotFoundError('Нет зарегистрированных пользователей');
        }
        res.send({ data: users });
      },
    )
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  if (id.length !== 24) {
    throw new NotFoundError(`Длина ID должна быть 24 знака, вы ввели ${id.length}`);
  }
  user.find({ _id: `${id}` })
  // eslint-disable-next-line no-shadow
    .then((user) => {
      if ((!user) || (user.length === 0)) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => user.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    // eslint-disable-next-line no-shadow
    .then((user) => {
      res.send({ data: user.toJSON() });
    }, (err) => {
      if (err.errors.email && err.errors.email.kind === 'unique') {
        throw new NotUnique(`Пользователь с  email ${err.errors.email.value} уже зарегистрирован`);
      }
      throw new BadRequest(`${err}`);
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  if ((!req.body.name) && (!req.body.about)) {
    throw new BadRequest('Ни одно из вводимых полей не может быть пустым');
  }
  user.findOneAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    { _id: req.user._id },
    {
      $set: {
        // _id: ObjectId,
        name: req.body.name,
        about: req.body.about,
      },
    },
  )
    .then((obj) => {
      res.send(obj);
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  if (!req.body.avatar) {
    throw new BadRequest('Значение не может быть пустым');
  }
  user.findOneAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    { _id: req.user._id },
    {
      $set: {
        // _id: ObjectId,
        avatar: req.body.avatar,
      },
    },
  )
    .then((obj) => {
      res.send(obj);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCreds(email, password)
    .then((u) => {
      res.send({
        token: jwt.sign(
          // eslint-disable-next-line no-underscore-dangle
          { _id: u._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch(next);
};
