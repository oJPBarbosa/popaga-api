const Group = require('../models/Group');

const { v4 } = require('uuid');

module.exports = {
  async index(req, res) {
    try {
      const groups = await Group.findAll({
        attributes: ['id', 'name', 'state', 'created_at'],
      });

      return res.status(200).json(groups);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const group = await Group.findOne({
        where: { id },
        attributes: ['name', 'state', 'created_at'],
      });

      if (!group)
        return res.status(404).send({
          error: `Group ${id} not found`,
        });

      return res.status(200).json(group);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async store(req, res) {
    const { name } = req.body;
    const id = v4();

    try {
      await Group.create({
        id,
        name,
        state: 'normal', // 3 states: cool, normal, negative
      });

      return res.status(201).json({ id });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
