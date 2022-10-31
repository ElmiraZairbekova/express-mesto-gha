const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const AuthorError = require('../errors/AuthorError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      // required: true,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      // required: true,
      default: 'Исследователь океана',
    },
    avatar: {
      type: String,
      // required: true,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => isUrl(url),
        message: 'Некорректная ссылка',
    },
  },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
  },
);
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorError('Некорректная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorError('Некорректная почта или пароль'));
          }
          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
