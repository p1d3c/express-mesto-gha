const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate('owner').populate({ path: 'likes', populate: 'owner' });
    res.status(200).send({ data: cards });
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка', err });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });

    res
      .status(201)
      .send(
        await Card
          .findById(newCard._id)
          .populate('owner')
          .populate({ path: 'likes', populate: 'owner' }),
      );
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
      return;
    }
    res.status(500).send({ message: 'Ошибка в работе сервера', err });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);
    if (!cardToDelete) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    if (err.name === 'CastError' && err.path === '_id') {
      res.status(400).send({ message: 'Некорректный id карточки' });
      return;
    }
    res.status(500).send({ message: err.message, err });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== 24) {
      res.status(400).send({ message: 'Некорректный id карточки' });
      return;
    }
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).send({ message: 'Лайк поставлен' });
  } catch (err) {
    if (err.name === 'CastError' && err.path === '_id') {
      res.status(404).send({ message: 'Передан несуществующий id', err });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== 24) {
      res.status(400).send({ message: 'Некорректный id карточки' });
      return;
    }
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).send({ message: 'Лайк снят' });
  } catch (err) {
    if (err.name === 'CastError' && err.path === '_id') {
      res.status(404).send({ message: 'Передан несуществующий id', err });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};
