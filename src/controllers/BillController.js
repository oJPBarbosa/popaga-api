const Bill = require('../models/Bill');
const Event = require('../models/Event');
const EventBill = require('../models/EventBill');
const User = require('../models/User');

const { v4 } = require('uuid');
const validate = require('uuid-validate');

module.exports = {
  async index(req, res) {
    try {
      const bills = await Bill.findAll({
        attributes: [
          'id',
          'name',
          'description',
          'value',
          'status',
          'created_at',
        ],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email', 'avatar'],
          },
        ],
      });

      if (!bills || bills.length === 0)
        return res.status(404).send({
          error: 'Bills not found',
        });

      return res.json(bills);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const bill = await Bill.findByPk(id, {
        attributes: [
          'id',
          'name',
          'description',
          'value',
          'status',
          'created_at',
        ],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email', 'avatar'],
          },
        ],
      });

      if (!bill)
        return res.status(404).send({
          error: 'Bill not found',
        });

      return res.json(bill);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async store(req, res) {
    const { name } = req.body;
    if (!name || name === '')
      return res.status(400).send({
        error: 'Invalid name',
      });

    const { description } = req.body;
    if (!description || description === '')
      return res.status(400).send({
        error: 'Invalid description',
      });

    const { value } = req.body;
    if (!value || value === '')
      return res.status(400).send({
        error: 'Invalid value',
      });

    const { status } = req.body;
    if (!status || status === '')
      return res.status(400).send({
        error: 'Invalid status',
      });

    const { owner_id } = req.body;
    if (!validate(owner_id, 4))
      return res.status(400).send({
        error: 'Invalid owner',
      });

    const userExists = await User.findByPk(owner_id);
    if (!userExists)
      return res.status(404).send({
        error: 'Owner not found',
      });

    const { event_id } = req.body;
    if (!validate(event_id, 4))
      return res.status(400).send({
        error: 'Invalid event',
      });

    const eventExists = await Event.findByPk(event_id);
    if (!eventExists)
      return res.status(404).send({
        error: 'Event not found',
      });

    try {
      const bill = await Bill.create({
        id: v4(),
        name,
        description,
        value,
        status,
        owner_id,
      });

      await EventBill.create({
        id: v4(),
        event_id,
        bill_id: bill.get('id'),
      });

      return res.status(201).json({
        id: bill.get('id'),
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, description, value, status } = req.body;

    if (!validate(id, 4))
      return res.status(400).send({
        error: 'Invalid bill',
      });

    if (!name && !description && !value && !status && !users_emails)
      return res.status(400).send({
        error: 'Nothing to update',
      });

    try {
      const bill = await Bill.findByPk(id);

      if (!bill)
        return res.status(400).send({
          error: 'Bill not found',
        });

      bill.name = name;
      bill.description = description;
      bill.value = value;
      bill.status = status;

      await bill.save();

      return res.send({
        message: 'Bill updated successfully',
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    if (!validate(id, 4))
      return res.status(400).send({
        error: 'Invalid bill',
      });

    try {
      const bill = await Bill.findByPk(id);

      if (!bill)
        return res.status(404).send({
          error: 'Bill not found',
        });

      const bill_events = await EventBill.findAll({
        where: {
          bill_id: id,
        },
      });

      bill_events.forEach(async (bill_event) => {
        await bill_event.destroy();
      });

      await bill.destroy();

      return res.send({
        message: 'Bill deleted successfully',
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
