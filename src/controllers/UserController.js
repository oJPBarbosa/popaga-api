const User = require('../models/User');

const { hash, compare } = require('bcrypt');
const { v4 } = require('uuid');
const { sign } = require('jsonwebtoken');

const config = require('../config/auth');

module.exports = {
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'avatar', 'created_at'],
      });

      return res.status(200).json(users);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findOne({
        where: { id },
        attributes: ['username', 'email', 'avatar', 'created_at'],
      });

      if (!user)
        return res.status(404).send({
          error: `User ${id} not found`,
        });

      return res.status(200).json(user);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async auth(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'password'],
      });

      const hashedPassword = user.get('password');
      const matches = await compare(password, hashedPassword);

      if (matches) {
        const token = sign(
          {
            id: user.get('id'),
          },
          config.secret,
          {
            expiresIn: 86400,
          }
        );

        return res.status(200).send({
          id: user.get('id'),
          token,
        });
      }

      return res.status(401).send({
        error: 'Bad credentials',
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async store(req, res) {
    const { username, email, password, avatar } = req.body;
    const id = v4();
    const hashedPassword = await hash(password, 8);

    const exists = await User.findOne({
      where: { email },
    });

    if (exists)
      return res.status(400).json({
        error: 'User already exists',
      });

    try {
      await User.create({
        id,
        username,
        email,
        password: hashedPassword,
        avatar,
      });

      return res.status(201).json({ id });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
