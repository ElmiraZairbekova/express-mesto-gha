const Card = require('../models/modelCard');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params._id)
    .orFail()
    .catch((err) => {
      if (err.message === 'NotFound') {
      throw new NotFoundError('Карточка не найдена');
      }
    })
    .then(() => res.send('Карточка удалена'))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail()
    .catch((err) => {
      if (err.message === 'NotFound') {
      throw new NotFoundError('Карточка не найдена');
      }
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail()
    .catch(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};