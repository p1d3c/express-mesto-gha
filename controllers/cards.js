const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const Card = require('../models/card');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send({ data: cards });
  } catch (err) {
    next();
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user.id;
    const newCard = await Card.create({ name, link, owner });
    res
      .status(201)
      .send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Ошибка валидации'));
      return;
    }
    next();
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const cardToDelete = await Card.findById(req.params.cardId);
  const ownerId = req.user.id;
  try {
    if (ownerId !== cardToDelete.owner._id.toString()) {
      next(new Forbidden('Чужие карточки удалять нельзя'));
      return;
    }
    if (!cardToDelete) {
      next(new NotFound('Карточка не найдена'));
      return;
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Некорректный id карточки'));
      return;
    }
    next();
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user.id } },
      { new: true },
    );
    if (!card) {
      next(new NotFound('Карточка не найдена'));
      return;
    }
    res.status(200).send({ message: 'Лайк поставлен' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Передан несуществующий id'));
      return;
    }
    next();
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user.id } },
      { new: true },
    );
    if (!card) {
      next(new NotFound('Карточка не найдена'));
      return;
    }
    res.status(200).send({ message: 'Лайк снят' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Передан несуществующий id'));
      return;
    }
    next();
  }
};
