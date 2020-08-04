const { Router } = require('express');
const User = require('../models/User');
const crypt = require('bcrypt');
const Todo = require('../models/Todo');
const { check, validationResult } = require('express-validator');
const router = new Router();
const reqHolidays = require("../utils/holidays");

router.post(
  '/register',
  [
    check('email', 'email is not corrected').isEmail(),
    check('password', 'min length password 8 symbols').isLength({ min: 8 }),
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
          .json({ message: 'such user already exists', isCorrected: false });
      }

      const hasPassword = await crypt.hash(password, 12);

      const holidays = await reqHolidays();

      const year = new Date().getFullYear();

      const todo = new Todo({
        [year]: holidays,
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
    check('email', 'email is not correct').normalizeEmail().isEmail(),
    check('password', 'password is not corrected').exists(),
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
