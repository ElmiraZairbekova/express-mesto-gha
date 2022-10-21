const Card = require("../models/cards");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const getCards = (req, res, next) => {
  Card.find({})
    .populate("user")
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
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then(() => res.send("Карточка удалена"))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .catch(() => {
      throw new NotFoundError("Карточка не найдена");
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
