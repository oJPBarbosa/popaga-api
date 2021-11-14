const Bill = require('../models/Bill');
const Group = require('../models/Group');

const { v4 } = require('uuid');

module.exports = {
  async index(req, res) {
    try {
      const bills = await Bill.findAll({
        attributes: [
          'id',
          'name',
          'description',
          'value',
          'state',
          'created_at',
        ],
        include: [
          {
            model: Group,
            as: 'group',
            attributes: ['id', 'name', 'state'],
          },
        ],
      });

      return res.status(200).json(bills);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const bill = await Bill.findOne({
        where: { id },
        attributes: ['name', 'description', 'value', 'state', 'created_at'],
        include: [
          {
            model: Group,
            attributes: ['id', 'name', 'state'],
          },
        ],
      });

      if (!bill)
        return res.status(404).send({
          error: `Bill ${id} not found`,
        });

      return res.status(200).json(bill);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async store(req, res) {
    const { name, description, value, state, group_id } = req.body;
    const id = v4();

    try {
      await Bill.create({
        id,
        name,
        description,
        value,
        state,
        group_id,
      });

      return res.status(201).json({ id });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
