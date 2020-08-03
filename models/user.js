const mongoose = require('mongoose');
const valid = require('validator');
const bcrypt = require('bcryptjs');

const uniqueValidator = require('mongoose-unique-validator');
const BadRequest = require('../midllewares/errors/errorHandler');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Это обязательное поле'],
    minlength: [2, 'Не меньше 2 знаков, пожалуйста'],
    maxlength: [30, 'Не больше 30 знаков, пожалуйста'],
  },
  about: {
    type: String,
    required: [true, 'Это обязательное поле'],
    minlength: [2, 'Не меньше 2 знаков, пожалуйста'],
    maxlength: [30, 'Не больше 30 знаков, пожалуйста'],
  },
  avatar: {
    type: String,
    required: [true, 'Введите валидную ссылку, пожалуйста'],
    validate: {
      validator(v) {
        return /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/.test(v);
      },
      message: 'Ссылка на картинку должна быть валидной.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => valid.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});
userSchema.statics.findUserByCreds = function (email, password) {
  return this.findOne({ email }).select('password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequest('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new BadRequest('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.plugin(uniqueValidator, { message: 'Error, expected {EMAIL} to be unique.' });
module.exports = mongoose.model('user', userSchema);
