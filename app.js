const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '626bdc792b272a3b6c5c30fd',
  };

  next();
});

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

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
