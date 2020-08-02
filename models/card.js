const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Это обязательное поле'],
    minlength: [2, 'Не меньше 2 знаков, пожалуйста'],
    maxlength: [30, 'Не больше 30 знаков, пожалуйста'],
  },
  link: {
    type: String,
    required: [true, 'Введите валидную ссылку, пожалуйста'],
    validate: {
      validator(v) {
        return /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/.test(v);
      },
      message: 'Ссылка на картинку, должна быть валидной.',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    required: true,
    default: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },

});

module.exports = mongoose.model('card', cardSchema);
