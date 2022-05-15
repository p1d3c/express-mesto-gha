const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(isAuthorized);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

async function handleDbConnect() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  // eslint-disable-next-line no-console
  console.log('Соединение с БД установлено');
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Слушаю ${PORT} порт`);
  });
}

handleDbConnect();
