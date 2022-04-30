const Card = require('../models/card');

// eslint-disable-next-line no-shadow
module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate('owner').populate({ path: 'likes', populate: 'owner' });
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка', err });
  }
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.errors.name === 'ValidationError') {
        res.status(400).send({
          message: 'Ошибка валидации',
          ...err,
        });
      }
      res.status(500).send({
        message: 'Ошибка в работе сервера',
        err,
      });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = async (req, res) => {
  try {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).send({ message: 'Лайк поставлен' });
  } catch (err) {
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.dislikeCard = (req) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  );
};
