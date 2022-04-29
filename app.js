const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use((req, res, next) => {
  req.user = {
    _id: '626bdc792b272a3b6c5c30fd',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`Слушаю ${PORT} порт`);
});
