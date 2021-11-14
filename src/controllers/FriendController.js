const Friend = require('../models/Friend');
const User = require('../models/User');

const { v4 } = require('uuid');

module.exports = {
  async show(req, res) {
    const user_id = req.params.id;

    try {
      const friends = await Friend.findAll({
        where: { user_id },
        attributes: ['created_at'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: User,
            as: 'friend',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      if (!friends || friends.length === 0)
        return res.status(404).send({
          error: `User ${user_id} has no friends`,
        });

      return res.status(200).json(friends);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async store(req, res) {
    const user_id = req.params.id;
    const { friend_id } = req.body;
    const id = v4();

    const exists = await Friend.findOne({ where: { user_id, friend_id } });

    if (exists)
      return res.status(400).json({
        error: `Friendship between ${user_id} and ${friend_id} already exists`,
      });

    try {
      await Friend.create({
        id,
        user_id,
        friend_id,
      });

      return res.status(201).json({ id });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
