const { Router } = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const crypt = require('bcrypt');
const Todo = require('../models/Todo');
const router = new Router();
const fetch = require('node-fetch');

const reqHolidays = async () => {
  const year = new Date().getFullYear();
  let holidays = [];
  let arr = [];

  await fetch(
    `${process.env.FESTIO_URL}${process.env.FESTIO_API}${process.env.FESTIO_PARAM}${year}`,
  )
    .then((r) => r.json())
    .then((r) => (holidays = r.holidays));
  holidays.forEach((item) => {
    if (item.public) {
      arr.push({
        name: item.name,
        date: item.date,
        important: true,
        time: '00:00:00',
      });
    }
  });
  return arr;
};

router.post(
  '/register',
  [
    check('email', 'email is not corected').isEmail(),
    check('password', 'min length password 8 simbols').isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const ers = validationResult(req);
      if (!ers.isEmpty()) {
        return res.status(400).json({
          message: 'data is not corrected',
          errors: ers.array(),
          isCorrected: false,
        });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'user has been life', isCorrected: false });
      }

      const hasPassword = await crypt.hash(password, 12);

      const holidays = await reqHolidays();

      const todo = new Todo({
        [2020]: holidays,
      });

      const user = new User({
        email,
        password: hasPassword,
        todoes: todo,
      });

      await user.save();
      await todo.save();

      res.status(201).json({
        message: 'user has been created',
        isCorrected: false,
      });
    } catch (e) {
      res.status(500).json({ message: 'error', isCorrected: false });
    }
  },
);

router.post(
  '/login',
  [
    check('email', 'email is not corect').normalizeEmail().isEmail(),
    check('password', 'password is not corected').exists(),
  ],
  async (req, res) => {
    try {
      const ers = validationResult(req);
      if (!ers.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'data is not corrected', isCorrected: false });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: 'user is not defined', isCorrected: false });
      }

      const isMatch = await crypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'password is not corrected', isCorrected: false });
      }

      const todo = await Todo.findOne(user.todoes._id);

      await todo[year].push({ date: '2021/01/09', text: 'дать толику пизду' });
      await todo[2020].push({
        date: '2021/01/09',
        text: 'извинится перед толиком',
      });

      await todo.save();

      res.json({
        user,
        isCorrected: true,
        message: 'login was successful',
        todo,
      });
    } catch (e) {
      res.status(500).json({ message: e });
    }
  },
);

module.exports = router;
