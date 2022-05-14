const bcrypt = require('bcrypt');
const User = require('../models/user');
const { getToken } = require('../middlewares/auth');

const SALT_ROUNDS = 10;

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
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id пользователя' });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      email, password: hash, name, about, avatar,
    });
    res.status(200).send({ data: newUser });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).send({ message: 'Пользователь уже существует' });
    }
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некоректные данные', err });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.status(200).send({ data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Пользователь не найден' });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.status(200).send({ data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Пользователь не найден' });
      return;
    }
    res.status(500).send({ message: 'server error', err });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Неправильные логин или пароль ' });
    return;
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).send({ message: 'Неправильные логин или пароль' });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).send({ message: 'Неправильные логин или пароль' });
      return;
    }

    const token = await getToken(user._id);

    res.status(200).send({ token });
    // res.status(200).cookie('jwt', token, {
    //   maxAge: 3600000 * 24 * 7,
    //   httpOnly: true,
    // })
    //   .end();
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err });
      return;
    }
    res.status(500).send({ err });
  }
};

module.exports.getMyProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    res.status(200).send({ data: user });
  } catch (err) {
    res.status(500).send({ err });
  }
};
