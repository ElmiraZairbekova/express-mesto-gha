const User = require('../models/modelUser');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .catch((err) => {
      if (err.message === 'NotFound') {
      throw new NotFoundError('Пользователь не найден');
      }
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    {
      name,
      about,
      avatar,
    },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};