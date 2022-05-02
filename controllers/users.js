const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ data: users });
  } catch (err) {
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.status(200).send({ data: user });
  } catch (err) {
    if (req.params.userId.length !== 24) {
      res.status(400).send({ message: 'Некорректный id пользователя' });
      return;
    }
    // if (err.name === 'CastError' && err.path === '_id') {
    //   res.status(404).send({ message: 'Пользователь не найден' });
    //   return;
    // }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.status(200).send({ data: newUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некоректные данные' });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    // if ((name.length < 2 || name.length > 30)
    // || (about.length < 2 || about.length > 30)) {
    //   res.status(400).send({ message: 'Ошибка валидации данных' });
    //   return;
    // }
    await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
    );
    const updatedUser = await User.findById(req.user._id);
    res.status(200).send({ data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
    }
    if (err.name === 'CastError' && err.path === '_id') {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    if (err.name === 'CastError' && err.path === 'about') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    if (err.name === 'CastError' && err.path === 'name') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
    );
    const updatedUser = await User.findById(req.user._id);
    res.status(200).send({ data: updatedUser });
  } catch (err) {
    if (err.name === 'CastError' && err.path === '_id') {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    if (err.name === 'CastError' && err.path === 'avatar') {
      res.status(400).send({ message: 'Переданы некоректные данные' });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};
