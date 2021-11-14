const Group = require('../models/Group');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');

const { v4 } = require('uuid');
const validate = require('uuid-validate');

module.exports = {
  async index(req, res) {
    try {
      const groups = await Group.findAll({
        attributes: ['id', 'name', 'status', 'created_at'],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      return res.json(groups);
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    if (id === '' || !validate(id, 4))
      return res.status(400).send({
        error: 'Invalid group',
      });

    try {
      const group = await Group.findOne({
        where: { id },
        attributes: ['name', 'status', 'created_at'],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      if (!group)
        return res.status(404).send({
          error: 'Group not found',
        });

      return res.json(group);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async store(req, res) {
    const { name, user_id } = req.body;

    if (!name || name === '')
      return res.status(400).send({
        error: 'Invalid name',
      });

    if (!validate(user_id, 4))
      return res.status(400).send({
        error: 'Invalid user',
      });

    const user = await User.findByPk(user_id);
    if (!user)
      return res.status(404).send({
        error: 'User not found',
      });

    try {
      const group = await Group.create({
        id: v4(),
        name,
        status: 'normal',
        owner_id: user_id,
      });

      // await user.addGroup(group); // not working
      await UserGroup.create({
        id: v4(),
        group_id: group.get('id'),
        user_id,
      });

      return res.status(201).json({
        id: group.get('id'),
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
  async update(req, res) {
    const { id } = req.params;
    const { name, user_ids } = req.body;

    if (id === '' || !validate(id, 4))
      return res.status(400).send({
        error: 'Invalid group',
      });

    if (!name && !user_ids)
      return res.status(400).send({
        error: 'Nothing to update',
      });

    try {
      const group = await Group.findByPk(id);

      if (!group)
        return res.status(400).send({
          error: 'Group not found',
        });

      if (name) {
        group.name = name;
        await group.save();
      } else {
        user_ids.forEach((user_id) => {
          if (!validate(user_id, 4))
            return res.status(400).send({
              error: 'Invalid user',
            });
        });

        user_ids.forEach(async (user_id) => {
          // const user = await User.findByPk(user_id);
          // await user.addGroup(group); // not working
          await UserGroup.create({
            id: v4(),
            group_id: id,
            user_id,
          });
        });
      }

      return res.status(200).send({
        message: 'Group updated successfully',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
  async destroy(req, res) {
    const { id } = req.params;

    if (id === '' || !validate(id, 4))
      return res.status(400).send({
        error: 'Invalid group',
      });

    const group = await Group.findByPk(id);

    if (!group)
      return res.status(404).send({
        error: 'Group not found',
      });

    await group.destroy();

    try {
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
