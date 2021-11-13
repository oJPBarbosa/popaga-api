const User = require('../models/User');

const { hash, compare } = require('bcrypt');
const { v4 } = require('uuid');
const { sign } = require('jsonwebtoken');

module.exports = {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'avatar', 'created_at'],
    });

    return res.json(users);
  },

  async show(req, res) {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id },
      attributes: ['username', 'email', 'avatar', 'created_at'],
    });

    return res.json(user);
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
          process.env.TOKEN,
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
        error: 'bad credentials',
      });
    } catch {
      return res.status(500).send({
        error: 'server fail',
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
        error: 'user already exists',
      });

    await User.create({
      id,
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    return res.status(201).json(
      await User.findOne({
        where: { id },
      })
    );
  },
};
