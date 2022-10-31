const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(users);
app.use(cards);
app.use(auth);
app.use(errors());
app.use(handleError);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.use((req, res) => {
  res.status(404)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
