const { Router } = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const crypt = require('bcrypt');
const router = new Router();

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
      const user = new User({ email, password: hasPassword });

      await user.save();

      res
        .status(201)
        .json({ message: 'user has been created', isCorrected: false });
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

      res.json({ user, isCorrected: true, message: 'login was successful' });
    } catch (e) {
      res.status(500).json({ message: 'error' });
    }
  },
);

module.exports = router;
